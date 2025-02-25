<?php

namespace App\Http\Controllers;

use App\Events\QuotationConfirmEvent;
use App\Models\Discount;
use App\Models\Fees;
use App\Models\Item;
use App\Models\Product;
use App\Models\Proposal;
use App\Models\ProposalFees;
use App\Models\Quotation;
use App\Models\ProposalProduct;
use App\Models\ProposalItem;
use App\Models\ProposalProductPrice;
use App\Models\School;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Exceptions;

class QuotationController extends Controller
{
    public function index(Request $req)
    {
        $new_quotations = $this->getQuotations(0);
        $quotations = $this->getQuotations(1);
        $accepted_quotations = $this->getQuotations(2);
        $order_issued = $this->getQuotations(3);

        $type = $req->type;
        return Inertia::render('Quotations/Quotations', compact('new_quotations', 'quotations', 'accepted_quotations', 'order_issued', 'type'));
    }

    public function view(Request $req)
    {
        $quotation = Quotation::where("quotation_id", $req->id)->first();

        $proposal = Proposal::leftJoin('school', 'school.user_id', 'proposal.user_id')
            ->where('proposal_id', $quotation['proposal_id'])->first();
        $origin = School::where('user_id', $proposal['user_id'])->select(['school_name', 'city'])->first();
        $proposal['origin'] = $origin['school_name'] . ', ' . $origin['city'];
        $prices = [];
        $quotation_product = ProposalProduct::where('proposal_id', $quotation['proposal_id'])->get();

        foreach ($quotation_product as $q) {
            $q['product'] = Product::where('id', $q['product_id'])->first();
            $price = ProposalProductPrice::where('proposal_product_id', $q['proposal_product_id'])->get();
            $q['prices'] = $price;
            $prices = array_merge($price->toArray(), $prices);
        }

        $quotation_item = ProposalItem::where('proposal_id', $quotation['proposal_id'])->get();
        foreach ($quotation_item as $q) {
            $q['item'] = Item::select(['item_id', 'item_name', 'item_type', 'unit_price'])->where('item_id', $q['item_id'])->first();
        }
        $fees = Fees::where('effective_date', '<=', now())->where('expiry_date', null)->get();
        $quotation_fees = ProposalFees::where('proposal_id', $quotation['proposal_id'])->get();
        $quotation_discount = Discount::where('quotation_id', $req->id)->first();

        return Inertia::render('Quotations/View', compact('quotation', 'proposal', 'quotation_product', 'quotation_item', 'prices', 'quotation_discount', 'fees', 'quotation_fees'));
    }

    public function confirm(Request $req)
    {
        $no = Quotation::where('quotation_status', '!=', 0)->whereYear('created_at', date('Y'))->count() + 1;

        try {
            Quotation::where('quotation_id', $req->id)->update([
                'quotation_no' => "HEROESQNO" . date("Y") . str_pad($no, 5, '0', STR_PAD_LEFT),
                'quotation_status' => 1
            ]);
            $proposal = Quotation::select(["proposal_id", "user_id"])->where('quotation_id', $req->id)->first();
            // dd($proposal);
            Proposal::where('proposal_id', $proposal['proposal_id'])->update([
                'proposal_status' => 3
            ]);

            foreach ($req->input('fees') as $fee) {
                ProposalFees::firstOrCreate([
                    'fee_id' => $fee['fee_id'],
                    'fee_type' => $fee['fee_type'],
                    'fee_amount' => $fee['fee_amount'],
                    'proposal_id' => $proposal['proposal_id'],
                    'fee_description' => $fee['fee_description']
                ]);
            }
            $school = School::where('user_id', $proposal['user_id'])->first();
            $quotation = Quotation::select(["quotation_no"])->where('quotation_id', $req->id)->first();
            event(new QuotationConfirmEvent($school, $quotation));

            return response()->json(["success" => "Quotation has been confirmed."]);
        } catch (Exceptions $e) {
            Log::error("Quotation cannot be confirmed. " . $req->id . " . " . $e);
            return response()->json(["error" => "There was an error confirming quotation."]);
        }
    }

    private function getQuotations($status)
    {
        $quotations = Quotation::select(['quotation.quotation_id', 'quotation_no', 'quotation_date', 'school_name', 'qty_student', 'quotation.proposal_id'])
            ->leftJoin('proposal', 'proposal.proposal_id', 'quotation.proposal_id')
            ->leftJoin('school', 'proposal.user_id', 'school.user_id')
            ->where('quotation_status', $status)->paginate(10);

        foreach ($quotations as $quotation) {
            $total = 0.00;
            $fee_amount = 0.00;

            $product_total = ProposalProduct::leftJoin('proposal_product_price', 'proposal_product.proposal_product_id', 'proposal_product_price.proposal_product_id')
                ->where('proposal_id', $quotation['proposal_id'])->select(DB::raw("sum(proposal_product_price.unit_price * proposal_product_price.qty) as total"))->first();
            $item_total = ProposalItem::where('proposal_id', $quotation['proposal_id'])->select(DB::raw("sum(item_qty * unit_price) as total"))->first();
            $total = $product_total['total'] + $item_total["total"];

            $quotation_discount = Discount::where('quotation_id', $quotation['quotation_id'])->first();

            $fees = ProposalFees::where('proposal_id', $quotation['proposal_id'])->get();
            foreach ($fees as $fee) {
                $fee_amount += $fee['fee_type'] === 'P' ? $total * $fee['fee_amount'] / 100 : $fee['fee_amount'];
            }
            $total += $fee_amount;

            $discount = 0;
            if ($quotation_discount) {
                if ($quotation_discount['discount_type'] == "F") {
                    $discount = $quotation_discount['discount_amount'];
                } else {
                    $discount = $total * $quotation_discount['discount_amount'] / 100;
                }
            }

            $quotation['amount'] = $total - $discount;
        }
        return $quotations;
    }

    public function updateVisitationDate(Request $req)
    {
        try {
            Proposal::where('proposal_id', $req->id)->update([
                'proposal_date' => $req->input('date')
            ]);
            $data['success'] = "Proposed Date Updated.";
            return response()->json($data);
        } catch (Exceptions $e) {
            Log::error('Error: visitation date update error. ' . $req->id . " " . $e);
            $data['error'] = "Error updating visitation date.";
            return response()->json($data);
        }
    }
}
