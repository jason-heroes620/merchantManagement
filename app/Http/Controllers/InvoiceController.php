<?php

namespace App\Http\Controllers;

use App\Models\Discount;
use Illuminate\Support\Facades\Log;

use App\Models\Invoice;
use App\Models\Order;
use App\Models\OrderTotal;
use App\Models\PaymentDetail;
use App\Models\Product;
use App\Models\Proposal;
use App\Models\ProposalProduct;
use App\Models\ProposalItem;
use App\Models\ProposalProductPrice;
use App\Models\Quotation;
use App\Models\School;
use Symfony\Component\Uid\UuidV8;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Exceptions;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    public function index(Request $req)
    {
        $invoices = $this->getInvoices(0);
        // $invoices = $this->getInvoices(1);
        // $cancelled_invoices = $this->getInvoices(2);
        $type = $req->type;
        return Inertia::render('Invoices/Invoices', compact('invoices', 'type'));
    }

    public function view(Request $req)
    {
        $invoice = Invoice::where('invoice_id', $req->id)->first();
        $order = Order::where('order_id', $invoice['order_id'])->first();
        $proposal = Proposal::where('proposal_id', $order['proposal_id'])->first();

        $total = 0;
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

        $discount = Discount::where('quotation_id', $order['quotation_id'])->first();

        $proposalItems = ProposalItem::leftJoin('item', 'item.item_id', 'proposal_item.item_id')
            ->where('proposal_id', $proposal['proposal_id'])
            ->get(["item.item_name", "proposal_item.item_qty", "proposal_item.unit_price"]);

        foreach ($proposalItems as $item) {
            $total += $item['item_qty'] * $item['unit_price'];
        }

        $orderTotal = OrderTotal::where('order_id', $order['order_id'])->orderBy('sort_order', 'asc')->get();

        $school = School::where('user_id', $proposal['user_id'])->first();
        $payment = PaymentDetail::where("order_no", $order["order_no"])->first();

        return Inertia::render(
            'Invoices/View',
            compact('invoice', 'order', 'proposal', 'proposalProduct', 'proposalItems', 'school', 'orderTotal', 'payment')
        );
    }

    public function create(Request $req)
    {
        try {
            $invoice_id = UuidV8::v4();
            $order = Order::where("order_id", $req->input('order_id'))->first();

            $invoice = Invoice::create([
                'invoide_id' => $invoice_id,
                'order_id' => $req->input('order_id'),
                'user_id' => $order['user_id'],
                'invoice_no' => $req->input('invoice_no'),
                'invoice_date' => date('Y-m-d'),
                'invoice_amount' => $order['order_amount'],
                'invoice_status' => 0
            ]);

            return response()->json([
                'message' => 'Invoice created successfully',
                'data' => $invoice
            ], 200);
        } catch (Exceptions $e) {
            Log::error($e);

            return response()->json([
                'message' => 'Failed to create invoice',
                'error' => $e
            ], 500);
        }
    }

    private function getInvoices($status)
    {
        $invoices = Invoice::where('invoice_status', $status)->orderBy('created_at', "DESC")->paginate(10);

        if ($invoices->count() > 0) {
            foreach ($invoices as $invoice) {
                $order = Order::where('order_id', $invoice['order_id'])->first();
                $proposal = Proposal::where('proposal_id', $order['proposal_id'])->first();
                $school = School::where('user_id', $proposal['user_id'])->first();
                $invoice['order'] = $order;
                $invoice['school'] = $school;
            }
        }

        return $invoices;
    }
}
