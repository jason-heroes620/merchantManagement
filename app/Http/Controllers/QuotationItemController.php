<?php

namespace App\Http\Controllers;

use App\Models\ProposalItem;
use App\Models\Quotation;
use App\Models\QuotationItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Exceptions;
use Illuminate\Support\Facades\Log;

class QuotationItemController extends Controller
{
    public function transportation_update(Request $req)
    {
        try {
            $transportations = $req->input('transportation');
            foreach ($transportations as $t) {
                QuotationItem::where('quotation_item_id', $t['quotation_item_id'])->update([
                    'unit_price' => $t['unit_price']
                ]);

                $quotation = Quotation::select(["proposal_id"])->where('quotation_id', $req->id)->first();
                ProposalItem::where('item_id', $t['item_id'])->where('proposal_id', $quotation['proposal_id'])
                    ->update([
                        "unit_price" => $t["unit_price"]
                    ]);
            }

            //  *** get quotation id then update proposal item as well

            return response()->json(["success" => "Price updated"]);
        } catch (Exceptions $e) {
            Log::error("Error updating transportation price for " . $req->id . " " . $e);
            return response()->json(["error" => "Error updating transportation price"]);
        }
    }
}
