<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductProfit;

use Illuminate\Http\Request;

class ProductProfitController extends Controller
{
    public function add_profit(Request $req)
    {
        $product = Product::find($req->id);

        $product_profit = ProductProfit::create([
            "merchant_id" => $product["merchant_id"],
            "product_id" => $req->id,
            "profit_type" => $req->input("profit_type"),
            "profit_value" => $req->input("profit_value"),
            "start_date" => $req->input("start_date"),
            "end_date" => $req->input("end_date")
        ]);

        return redirect()->back()->with(["success" => "profit added"]);
    }
}
