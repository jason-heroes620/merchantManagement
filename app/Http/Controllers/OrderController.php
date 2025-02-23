<?php

namespace App\Http\Controllers;

use App\Events\CreateOrderEvent;
use App\Models\Discount;
use App\Models\Order;
use App\Models\OrderTotal;
use App\Models\PaymentDetail;
use App\Models\Product;
use App\Models\Proposal;
use App\Models\ProposalFees;
use App\Models\ProposalItem;
use App\Models\ProposalProduct;
use App\Models\ProposalProductPrice;
use App\Models\Quotation;
use App\Models\School;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Exceptions;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Symfony\Component\Uid\UuidV8;

class OrderController extends Controller
{
    public function index(Request $req)
    {
        $user = $req->user();
        $pending_payment = $this->getOrders(0);
        $paid = $this->getOrders(2);
        $type = $req->type;
        return Inertia::render('Orders/Orders', compact('pending_payment', 'paid', 'type'));
    }

    public function create(Request $req)
    {
        $order = "";
        $order_no = "";

        $quotation = Quotation::where('quotation_id', $req->input('quotation_id'))->first();
        $proposal = Proposal::where('proposal_id', $quotation['proposal_id'])->first();

        // today + 14 days not more than proposal_date then deposit due date = today + 14 days
        // $deposit_due_date = date('Y-m-d', strtotime('+14 days'));
        // (strtotime(date('Y-m-d')) + strtotime($proposal['proposal_date'])) /  (60 * 60 * 24) > 14 ? date('Y-m-d', strtotime('-14 days', strtotime($proposal['proposal_date']))) : date('Y-m-d');
        // $deposit_due_date = $proposal['proposal_date'] > $deposit_due_date  ? $deposit_due_date : date('Y-m-d');

        // proposed_date - 14 days < today then balance due date = today else balance due date  = proposal_date - 14 days
        // $balance_due_date = date('Y-m-d', strtotime('-14 days', strtotime($proposal['proposal_date'])));
        // $balance_due_date = date('Y-m-d') < $balance_due_date && $balance_due_date > $deposit_due_date ? $balance_due_date : $deposit_due_date;
        $deposit_due_date = date('Y-m-d', strtotime($req->input('depositDueDate')));
        $balance_due_date = date('Y-m-d', strtotime($req->input('balanceDueDate')));
        try {
            Quotation::where('quotation_id', $req->input('quotation_id'))->update([
                'quotation_status' => 3
            ]);

            if ($req->input('order_type') === 'deposit') {
                $order = $this->createOrder($req->input('quotation_id'), $req->input('deposit'), $deposit_due_date, 'D', $req->input('subTotal'), $req->input('discountTotal'), $req->input('quotation_amount'), 0);
                $order2 = $this->createOrder($req->input('quotation_id'), $req->input('balance'), $balance_due_date, 'B', $req->input('subTotal'), $req->input('discountTotal'), $req->input('quotation_amount'), $req->input('deposit'));
            } else {
                $order = $this->createOrder($req->input('quotation_id'), $req->input('quotation_amount'), $balance_due_date, 'F', $req->input('subTotal'), $req->input('discountTotal'), $req->input('quotation_amount'), 0);
            }

            $school = School::select(["contact_person", "email"])->where('user_id', $proposal['user_id'])->first();
            $orders = Order::select(['order_no'])->where('quotation_id', $req->input('quotation_id'))->get();

            event(new CreateOrderEvent($school, $orders));
            return response()->json([
                'message' => 'Order created',
                'data' => $order
            ], 200);
        } catch (Exceptions $e) {
            Log::error($e);

            return response()->json([
                'message' => 'Failed to create order',
                'error' => $e
            ], 500);
        }
    }

    public function view(Request $req)
    {
        $order = Order::where('order_id', $req->id)->first();
        $quotation = Quotation::where('quotation_id', $order['quotation_id'])->first();
        $proposal = Proposal::where('proposal_id', $quotation['proposal_id'])->first();

        $total = 0;
        $fee_amount = 0.00;

        $product_price = [];
        $proposalProduct = ProposalProduct::where('proposal_product.proposal_id', $proposal['proposal_id'])->get();
        foreach ($proposalProduct as $product) {
            $product_price = ProposalProductPrice::where('proposal_product_id', $product['proposal_product_id'])->get();
            $product['product_price'] = $product_price;
            $product['product'] = Product::select(["product_name"])->where('id', $product['product_id'])->first();
            foreach ($product_price as $price) {
                $total += $price['qty'] * $price['unit_price'];
            }
        }

        $discount = Discount::where('quotation_id', $quotation['quotation_id'])->first();

        $proposalItems = ProposalItem::leftJoin('item', 'item.item_id', 'proposal_item.item_id')
            ->where('proposal_id', $proposal['proposal_id'])
            ->get(["item.item_name", "proposal_item.item_qty", "proposal_item.unit_price"]);

        foreach ($proposalItems as $item) {
            $total += $item['item_qty'] * $item['unit_price'];
        }

        $fees = ProposalFees::where('proposal_id', $proposal['proposal_id'])->get();
        foreach ($fees as $fee) {
            $fee_amount += $fee['fee_type'] === 'P' ? $total * $fee['fee_amount'] / 100 : $fee['fee_amount'];
        }
        $total += $fee_amount;
        $orderTotal = OrderTotal::where('order_id', $req->id)->orderBy('sort_order', 'asc')->get();

        $school = School::where('user_id', $proposal['user_id'])->first();
        $payment = "";

        if ($order['order_status'] === 2) {
            $payment = PaymentDetail::where("order_no", $order["order_no"])->first();
        }
        return Inertia::render(
            'Orders/View',
            compact('order', 'proposal', 'proposalProduct', 'proposalItems', 'school', 'orderTotal', 'payment')
        );
    }

    private function createOrder($quotation_id, $amount, $due_date, $order_type, $subTotal, $discountTotal, $total, $deposit)
    {
        $no = Order::whereYear('created_at', date('Y'))->count() + 1;
        $order_id = UuidV8::v4();
        $quotation = Quotation::where("quotation_id", $quotation_id)->first();
        $proposal = Proposal::where('proposal_id', $quotation['proposal_id'])->select(['user_id'])->first();

        $order = Order::create([
            'order_id' => $order_id,
            'quotation_id' => $quotation['quotation_id'],
            'user_id' => $proposal['user_id'],
            'order_no' => date("Y") . str_pad($no, 5, '0', STR_PAD_LEFT),
            'order_date' => date('Y-m-d'),
            'order_amount' => $amount,
            'due_date' => $due_date,
            'order_status' => 0,
            'order_type' => $order_type,
            'proposal_id' => $quotation['proposal_id'],
            'order_description' => ''
        ]);

        $codes = [['sub_total', 'Sub Total', $subTotal, 1], ['discount', 'Discount', $discountTotal, 20], ['total', 'Total', $total, 50]];
        foreach ($codes as $code) {
            OrderTotal::create([
                'order_id' => $order_id,
                'code' => $code[0],
                'title' => $code[1],
                'value' => $code[2],
                'sort_order' => $code[3]
            ]);
        }
        if ($order_type === 'D') {
            OrderTotal::create([
                'order_id' => $order_id,
                'code' => 'deposit',
                'title' => 'Deposit (50%)',
                'value' => $amount,
                'sort_order' => 60
            ]);
        }

        if ($order_type === 'B') {
            OrderTotal::create([
                'order_id' => $order_id,
                'code' => 'deposit',
                'title' => 'Deposit',
                'value' => -$amount,
                'sort_order' => 60
            ]);

            OrderTotal::create([
                'order_id' => $order_id,
                'code' => 'balance',
                'title' => 'Balance',
                'value' => $amount,
                'sort_order' => 61
            ]);
        }

        if ($order_type === 'F') {
            OrderTotal::create([
                'order_id' => $order_id,
                'code' => 'balance',
                'title' => 'Balance Due',
                'value' => $amount,
                'sort_order' => 60
            ]);
        }

        $fees = ProposalFees::where('proposal_id', $quotation['proposal_id'])->get();
        foreach ($fees as $fee) {
            $i = 10;
            OrderTotal::create([
                'order_id' => $order_id,
                'code' => 'fee',
                'title' => $fee['fee_description'],
                'value' => $fee['fee_type'] === 'P' ? $subTotal * $fee['fee_amount'] / 100 : $fee['fee_amount'],
                'sort_order' => $i,
            ]);
            $i++;
        }

        return $order_id;
    }

    private function getOrders($status)
    {
        $orders = Order::where('order_status', $status)
            ->orderBy('created_at', 'DESC')
            ->paginate(10);

        foreach ($orders as $order) {
            $school = School::select(['school_name'])->where('user_id', $order['user_id'])->first();
            $order['school_name'] = $school['school_name'];
        }

        return $orders;
    }
}
