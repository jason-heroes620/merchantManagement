<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    public function current(Request $req)
    {
        $user = $req->user();
        $limit = 5;
        $products = Product::where('merchant_id', $user->id)->with('merchant')
            ->leftJoin('product_detail', 'products.id', '=', 'product_detail.product_id')
            ->where('status', 0)
            ->where('product_detail.event_start_date', '<=', date('Y-m-d', strtotime(now())))
            ->where('product_detail.event_end_date', '>=', date('Y-m-d', strtotime(now())))
            ->offset($req->page * $limit)
            ->limit($limit)
            ->get(['products.id', 'products.product_name', 'product_detail.event_start_date', 'product_detail.event_end_date']);

        return $this->sendResponse($products, '');
    }

    public function comingup(Request $req)
    {
        $user = $req->user();
        $limit = 5;
        $products = Product::where('merchant_id', $user->id)->with('merchant')
            ->leftJoin('product_detail', 'products.id', '=', 'product_detail.product_id')
            ->where('status', 0)
            ->offset($req->page * $limit)
            ->limit($limit)
            ->where('product_detail.event_start_date', '>', date('Y-m-d', strtotime(now())))
            ->get(['products.id', 'products.product_name', 'product_detail.event_start_date', 'product_detail.event_end_date']);

        return $this->sendResponse($products, '');
    }

    public function history(Request $req)
    {
        $user = $req->user();
        $limit = 5;
        $products = Product::where('merchant_id', $user->id)->with('merchant')
            ->leftJoin('product_detail', 'products.id', '=', 'product_detail.product_id')
            ->where('status', 1)
            ->where('product_detail.event_end_date', '<', date('Y-m-d', strtotime(now())))
            ->offset($req->page * $limit)
            ->limit($limit)
            ->orderBy('product_detail.event_start_date')
            ->get(['products.id', 'products.product_name', 'product_detail.event_start_date', 'product_detail.event_end_date']);

        return $this->sendResponse($products, '');
    }
}
