<?php

namespace App\Http\Controllers;

use App\Events\CreateOrderEvent;
use App\Events\OrderUpdateEvent;
use App\Models\Discount;
use App\Models\Invoice;
use App\Models\Item;
use App\Models\Order;
use App\Models\OrderTotal;
use App\Models\PaymentDetail;
use App\Models\Product;
use App\Models\ProductDetail;
use App\Models\Proposal;
use App\Models\ProposalFees;
use App\Models\ProposalItem;
use App\Models\ProposalProduct;
use App\Models\ProposalProductPrice;
use App\Models\Quotation;
use App\Models\ReservedDate;
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
        $type = $req->input('tab', $req->type ?? 'pending');

        $user = $req->user();
        $pending_payment = $this->getOrders(0);
        $paid = $this->getOrders(2);
        $failed = $this->getOrders(4);
        $cancelled = $this->getOrders(9);

        return Inertia::render('Orders/Orders', compact('pending_payment', 'paid', 'failed', 'cancelled', 'type'));
    }

    public function create(Request $req)
    {
        $order = "";
        $proposal = Proposal::where('proposal_id', $req->input('proposal_id'))->first();

        $deposit_due_date = date('Y-m-d', strtotime($req->input('depositDueDate')));
        $balance_due_date = date('Y-m-d', strtotime($req->input('balanceDueDate')));

        try {
            if ($this->canCreateOrder($proposal)) {
                foreach ($req->input('fees') as $fee) {
                    ProposalFees::firstOrCreate([
                        'fee_id' => $fee['fee_id'],
                        'fee_type' => $fee['fee_type'],
                        'fee_amount' => $fee['fee_amount'],
                        'proposal_id' => $proposal['proposal_id'],
                        'fee_description' => $fee['fee_description']
                    ]);
                }

                Proposal::where('proposal_id', $req->input('proposal_id'))->update([
                    'proposal_status' => 3
                ]);

                if ($req->input('order_type') === 'deposit') {
                    $order = $this->createOrder($req->input('proposal_id'), $req->input('deposit'), $deposit_due_date, 'D', $req->input('subTotal'), $req->input('discountTotal'), $req->input('proposal_amount'), $req->input('deposit'));
                    $this->createOrder($req->input('proposal_id'), $req->input('balance'), $balance_due_date, 'B', $req->input('subTotal'), $req->input('discountTotal'), $req->input('proposal_amount'), $req->input('deposit'));
                } else {
                    $order = $this->createOrder($req->input('proposal_id'), $req->input('proposal_amount'), $balance_due_date, 'F', $req->input('subTotal'), $req->input('discountTotal'), $req->input('proposal_amount'), 0);
                }

                $school = School::select(["contact_person", "email"])->where('user_id', $proposal['user_id'])->first();
                $orders = Order::select(['order_no'])->where('proposal_id', $req->input('proposal_id'))->get();

                event(new CreateOrderEvent($school, $orders));

                return response()->json([
                    'message' => 'Order created.',
                    'data' => ['success' => $order]
                ], 200);
            } else {
                return response()->json([
                    'message' => 'Order cannot be created!',
                    'data' => ['error' => $order]
                ], 202);
            }
        } catch (Exceptions $e) {
            Log::error($e);

            return response()->json([
                'message' => 'Failed to create order',
                'error' => $e
            ], 500);
        }
    }

    private function canCreateOrder($proposal)
    {
        // check if can create order, based on product max group and reserved date
        $eligible = true;
        $proposal_products = ProposalProduct::where('proposal_id', $proposal['proposal_id'])->get();

        foreach ($proposal_products as $p) {
            $dates = ReservedDate::where('product_id', $p['product_id'])->where('reserved_date', $proposal['proposal_date'])->where('user_id', '!=', $proposal['user_id'])->count();
            $product = Product::where('id', $p['product_id'])->first();

            if ($dates + 1 > $product['max_group']) {
                $eligible = false;
            }
        }

        return $eligible;
    }

    public function view(Request $req)
    {
        $order = Order::where('order_id', $req->id)->first();
        $proposal = Proposal::where('proposal_id', $order['proposal_id'])->first();

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

        $discount = Discount::where('proposal_id', $proposal['proposal_id'])->first();

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
            $payment = PaymentDetail::where("order_no", $order["order_no"])->where('bank_ref', '!=', '')->first();
        }

        $invoice = Invoice::where('order_id', $req->id)->get();

        return Inertia::render(
            'Orders/View',
            compact('order', 'proposal', 'proposalProduct', 'proposalItems', 'school', 'orderTotal', 'payment', 'invoice')
        );
    }

    public function edit(Request $req)
    {
        $order = Order::where('order_id', $req->id)->first();
        $proposal = Proposal::where('proposal_id', $order['proposal_id'])->first();

        $proposal_product = ProposalProduct::where('proposal_id', $proposal["proposal_id"])->get();

        $product_end_date = null;
        foreach ($proposal_product as $p) {
            $location = Product::where('id', $p['product_id'])->first();
            $p['location'] = $location;
            $detail = ProductDetail::where('product_id', $location['id'])->first();

            if ($product_end_date === null) {
                $end_date = $detail['event_end_date'];
            } else {
                if ($product_end_date < $detail['event_end_date'])
                    $product_end_date = $detail['event_end_date'];
            }
        }

        $order_total = OrderTotal::where('order_id', $req->id)->get();

        $product_prices = ProposalProduct::leftJoin('proposal_product_price', 'proposal_product_price.proposal_product_id', 'proposal_product.proposal_product_id')->where('proposal_id', $proposal['proposal_id'])->get();
        $items = Item::where('item_status', 0)->get(["item_id", "item_name", "unit_price", "item_type", "uom", "additional_unit_cost", "item_image", "item_status", "item_description", "product_id"]);

        $proposal_item = ProposalItem::leftJoin('item', 'proposal_item.item_id', '=', 'item.item_id')
            ->where('proposal_item.proposal_id', $proposal['proposal_id'])->get(["item.item_id", "item_name", "item.uom", "item_qty", "proposal_item.unit_price", "item.sales_tax", "item_type", "item.additional_unit_cost"]);
        $proposal_fees = ProposalFees::where('proposal_id', $proposal['proposal_id'])->get();

        return Inertia::render('Orders/Edit', compact('order', 'proposal', 'proposal_product', 'product_prices', 'items', 'proposal_item', 'proposal_fees', 'end_date', 'product_end_date', 'order_total'));
    }

    private function createOrder($proposal_id, $amount, $due_date, $order_type, $subTotal, $discountTotal, $total, $deposit)
    {
        $no = Order::whereYear('created_at', date('Y'))->count() + 1;
        $order_id = UuidV8::v4();
        $proposal = Proposal::where('proposal_id', $proposal_id)->select(['user_id'])->first();

        Order::create([
            'order_id' => $order_id,
            'quotation_id' => "",
            'user_id' => $proposal['user_id'],
            'order_no' => date("Y") . str_pad($no, 5, '0', STR_PAD_LEFT),
            'order_date' => date('Y-m-d'),
            'order_amount' => $amount,
            'due_date' => $due_date,
            'order_status' => 0,
            'order_type' => $order_type,
            'proposal_id' => $proposal_id,
            'order_description' => ''
        ]);

        if ($order_type === 'D') {
            OrderTotal::create([
                'order_id' => $order_id,
                'code' => 'total',
                'title' => 'Total',
                'value' => $amount,
                'sort_order' => 60
            ]);
        }

        if ($order_type === 'B' || $order_type === 'F') {
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

            $fees = ProposalFees::where('proposal_id', $proposal_id)->get();
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
        }

        if ($order_type === 'B') {
            OrderTotal::create([
                'order_id' => $order_id,
                'code' => 'deposit',
                'title' => 'Deposit',
                'value' => -$deposit,
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

        return $order_id;
    }

    public function update(Request $req)
    {
        $order = Order::where('order_id', $req->id)->first();
        try {
            Proposal::where('proposal_id', $req->input('proposal_id'))->update([
                'proposal_date' => !empty($req->input('proposal_date')) ? date('Y-m-d', strtotime(str_replace('/', '-', $req->input('proposal_date')))) : null,
                'qty_student' => $req->input('qty_student'),
                'qty_teacher' => $req->input('qty_teacher'),
            ]);

            $proposal_product = ProposalProduct::where('proposal_id', $req->input('proposal_id'))->get();
            foreach ($proposal_product as $p) {
                ProposalProductPrice::where('proposal_product_id', $p['proposal_product_id'])
                    ->where('attribute', 'student')
                    ->update([
                        'qty' => $req->input('qty_student')
                    ]);
                ProposalProductPrice::where('proposal_product_id', $p['proposal_product_id'])
                    ->where('attribute', 'teacher')
                    ->update([
                        'qty' => $req->input('qty_teacher')
                    ]);
            }

            ProposalItem::where('proposal_id', $req->input('proposal_id'))->delete();

            if (sizeof($req->input('proposal_items')) > 0) {
                $this->addOrRemoveProposalItem($req->input('proposal_items'), $req->input('proposal_id'));
            }

            foreach ($req->input('order_total') as $o) {
                OrderTotal::where('order_total_id', $o['order_total_id'])->update([
                    'value' => $o['value']
                ]);
            }


            $data["success"] = "Order updated";
            $school = School::where('user_id', $order['user_id'])->first();
            // add event to notify user of updated order
            event(new OrderUpdateEvent($school, $order));

            return response()->json($data);
        } catch (Exceptions $e) {
            Log::info($e);
            $data["failed"] = "Proposal update failed";
            return response()->json($data);
        }
    }

    private function addOrRemoveProposalItem($itemArray, $proposal_id)
    {
        try {
            // Log::info($itemArray . ' ' . $proposal_id);
            foreach ($itemArray as $t) {
                $item = Item::where('item_id', $t['item_id'])->first();
                ProposalItem::updateOrCreate(
                    ['proposal_id' => $proposal_id, 'item_id' => $t['item_id'],],
                    ['item_qty' => $t['item_qty'], 'uom' => $t['uom'], 'unit_price' => $t['unit_price'], 'sales_tax' => $item['sales_tax']]
                );
            }
        } catch (Exceptions $e) {
            Log::info('error ', $e);
        }
    }

    private function getOrders($stat)
    {
        $page = "";
        $tab = "";
        $status = [];
        if ($stat === 0) {
            $page = "PendingPage";
            $tab = "pending";
            $status = [0, 1];
        } else if ($stat === 4) {
            $page = "FailedPage";
            $tab = "fail";
            $status = [4];
        } else if ($stat === 2) {
            $page = "PaidPage";
            $tab = "paid";
            $status = [2];
        } else {
            $page = "CancelledPage";
            $tab = "cancelled";
            $status = [9];
        }
        $orders = Order::whereIn('order_status', $status)
            ->orderBy('created_at', 'DESC')
            ->paginate(
                10,
                ['*'],
                $page
            )->appends(['tab' => $tab]);

        foreach ($orders as $order) {
            $school = School::select(['school_name'])->where('user_id', $order['user_id'])->first();
            $order['school_name'] = $school['school_name'];
        }

        return $orders;
    }
}
