<?php

namespace App\Http\Controllers;

use App\Models\Discount;
use App\Models\Fees;
use App\Models\Item;
use App\Models\Product;
use App\Models\ProductDetail;
use App\Models\Proposal;
use App\Models\ProposalFees;
use App\Models\ProposalFiles;
use App\Models\ProposalItem;
use App\Models\ProposalProduct;
use App\Models\ProposalProductPrice;
use App\Models\ReservedDate;
use App\Models\School;
use Illuminate\Http\Client\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Exceptions;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ProposalController extends Controller
{
    public function index(Request $req)
    {
        $type = $req->input('tab', $req->type ?? 'current');

        $user = $req->user();
        $proposals = $this->getProposals(0, 'current', 'CurrentPage');
        $requestingOrder = $this->getProposals(2, 'requestingOrder', 'RequstingOrderPage');

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
        // dd(isEmpty($proposal_fees));
        if ($proposal_fees) {
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
                    'min_charges' => $fee['min_charges'],
                ];
            }
        }
        // dd($proposal_fees);
        $items = Item::where('item_status', 0)->get(["item_id", "item_name", "unit_price", "item_type", "uom", "additional_unit_cost", "item_image", "item_status", "item_description", "product_id", "sales_tax"]);
        $proposal_discount = Discount::where('proposal_id', $req->id)->first();
        $proposal_file = ProposalFiles::where('proposal_id', $req->id)->first();

        if ($proposal_file) {
            $file_name = explode('/', $proposal_file['file_path']);
            $path = config('custom.trip_host') . 'storage/proposal_files/' . $file_name[sizeof($file_name) - 1];
            $proposal['proposal_file'] = $path ?? null;
        }

        return Inertia::render('Proposals/View', compact('proposal', 'proposal', 'proposal_product', 'proposal_item', 'prices', 'proposal_discount', 'proposal_fees', 'items'));
    }

    private function getProposals($status, $tab, $page)
    {
        $proposals = Proposal::where('proposal_status', $status)
            ->orderByRaw('ISNULL(proposal_date), proposal_date ASC')
            ->paginate(
                10,
                ['*'],
                $page
            )->appends(['tab' => $tab]);

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

    public function fileDownload(Request $req)
    {
        $file = ProposalFiles::where('proposal_id', $req->id)->first();
        if ($file) {
            $file_name = explode('/', $file['file_path']);
            $path = config('custom.trip_host') . 'storage/proposal_files/' . $file_name[sizeof($file_name) - 1];
            // return response()->download($path, $file['original_file_name']);
            return response()->download($path);
        }
        return response()->json(['error' => 'File not found'], 404);
    }

    public function update(Request $req)
    {
        $user = $req->user();
        try {
            Proposal::where('proposal_id', $req->input('proposal_id'))->update([
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

            $data["success"] = "Proposal updated";

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
}
