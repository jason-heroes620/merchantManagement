<?php

namespace App\Http\Controllers;

use App\Models\Discount;
use App\Models\Fees;
use App\Models\Item;
use App\Models\Product;
use App\Models\ProductDetail;
use App\Models\Proposal;
use App\Models\ProposalFees;
use App\Models\ProposalItem;
use App\Models\ProposalProduct;
use App\Models\ProposalProductPrice;
use App\Models\ReservedDate;
use App\Models\School;
use Illuminate\Http\Request;
use Inertia\Inertia;


class ProposalController extends Controller
{
    public function index(Request $req)
    {
        $type = $req->input('tab', $req->type ?? 'current');

        $user = $req->user();
        $proposals = $this->getProposals(0);
        $requestingOrder = $this->getProposals(2);

        return Inertia::render('Proposals/Proposals', compact('proposals', 'requestingOrder', 'type'));
    }

    public function view(Request $req)
    {
        $proposal = Proposal::leftJoin('school', 'school.user_id', 'proposal.user_id')
            ->where('proposal_id', $req->id)->first();
        $origin = School::where('user_id', $proposal['user_id'])->select(['school_name', 'city'])->first();
        $proposal['origin'] = $origin['school_name'] . ', ' . $origin['city'];
        $prices = [];
        $proposal_product = ProposalProduct::where('proposal_id', $proposal['proposal_id'])->get();

        foreach ($proposal_product as $p) {
            $p['product'] = Product::where('id', $p['product_id'])->first();
            $price = ProposalProductPrice::where('proposal_product_id', $p['proposal_product_id'])->get();
            $p['prices'] = $price;
            $prices = array_merge($price->toArray(), $prices);
        }

        $subTotal = 0;
        $fee_type = 'P';
        $proposal_item = ProposalItem::where('proposal_id', $proposal['proposal_id'])->get();
        foreach ($proposal_item as $p) {
            $p['item'] = Item::select(['item_id', 'item_name', 'item_type', 'unit_price'])->where('item_id', $p['item_id'])->first();
            $subTotal += $p['unit_price'] * $p['item_qty'];
        }

        foreach ($prices as $price) {
            $subTotal += $price['qty'] * $price['unit_price'];
        }

        $proposal_fees = ProposalFees::where('proposal_id', $proposal['proposal_id'])->get();
        if ($proposal_fees->isEmpty()) {
            $fees = Fees::where('effective_date', '<=', now())->where('expiry_date', null)->get();
            foreach ($fees as $fee) {
                $fee_charges = 0;
                if ($fee['fee_type'] === 'P') {
                    $fee_charges = $subTotal * $fee['fee_amount'] / 100;

                    if ($fee_charges < $fee['min_charges']) {
                        $fee_charges = $fee['min_charges'];
                        $fee_type = 'F';
                    }
                } else {
                    $fee_charges = $fee_charges < $fee['min_charges'] ? $fee['min_charges'] : $fee_charges;
                    $fee_type = 'F';
                }

                $proposal_fees = [
                    'fee_id' => $fee['fee_id'],
                    'fee_type' => $fee_type,
                    'fee_description' => $fee['fee_description'],
                    'fee_amount' => $fee['fee_amount'],
                    'fee_charges' => $fee_charges,
                ];
            }
        }

        $proposal_discount = Discount::where('proposal_id', $req->id)->first();

        return Inertia::render('Proposals/View', compact('proposal', 'proposal', 'proposal_product', 'proposal_item', 'prices', 'proposal_discount', 'proposal_fees'));
    }

    private function getProposals($status)
    {
        $proposals = Proposal::where('proposal_status', $status)->orderByRaw('ISNULL(proposal_date), proposal_date ASC')->paginate(10);

        foreach ($proposals as $p) {
            $p['school'] = School::select(['school_name'])->where('user_id', $p['user_id'])->first();
        }
        return $proposals;
    }

    public function getDisabledDays(Request $req)
    {
        $proposal_products = ProposalProduct::where('proposal_id', $req->id)->get(['product_id']);
        $data = [0, 6];
        foreach ($proposal_products as $p) {
            $detail = ProductDetail::where('product_id', $p['product_id'])->first();

            if ($detail['monday_start_time'] === null)
                array_push($data, 1);
            if ($detail['tuesday_start_time'] === null)
                array_push($data, 2);
            if ($detail['wednesday_start_time'] === null)
                array_push($data, 3);
            if ($detail['thursday_start_time'] === null)
                array_push($data, 4);
            if ($detail['friday_start_time'] === null)
                array_push($data, 5);
        }

        return response()->json(array_unique($data));
    }

    public function getDisabledDates(Request $req)
    {
        $user = $req->user();
        $reserved = [];
        $dates = ReservedDate::whereIn('product_id', $req->input('locationId'))->where('reserved_date', '>=', now())->get();
        foreach ($dates as $date) {
            $product = Product::where('id', $date['product_id'])->first();
            $count = ReservedDate::where('reserved_date', $date['reserved_date'])->count();
            if ($date['user_id'] !== $user->id && $product['max_group'] < $count + 1) {
                array_push($reserved, $date['reserved_date']);
            }
        }

        return array_unique($reserved);
    }
}
