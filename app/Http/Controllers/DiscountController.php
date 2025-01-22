<?php

namespace App\Http\Controllers;

use App\Models\Discount;
use Illuminate\Http\Request;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Support\Facades\Log;


class DiscountController extends Controller
{
    public function create(Request $req)
    {
        try {
            Discount::updateOrCreate(
                ['quotation_id' => $req->input('quotation_id')],
                ['discount_type' => $req->input('discount_type'), 'discount_amount' => $req->input('discount_amount')]
            );
            return response()->json(["success" => "Discount updated."]);
        } catch (Exceptions $e) {
            Log::error("error adding discount. " . $e);
            return response()->json(["error" => "Discount failed to update."]);
        }
    }
}
