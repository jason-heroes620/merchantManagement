<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Role;
use App\Models\Frequency;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use App\Http\Controllers\CategoryController;
use App\Models\ProductDetail;

class ProductController extends Controller
{
    public function products(Request $req): Response
    {
        $user = $req->user();
        $role = $user->roles->pluck('name')->toArray();

        if ($role[0] === 'admin') {
            $newProducts = Product::with('merchant')->where('status', 1)->paginate(10);
            $products = Product::with('merchant')->where('status', 0)->paginate(10);
        } else {
            $newProducts = Product::where('merchant_id', $user->id)->with('merchant')
                ->where('status', 1)->paginate(10);
            $products = Product::where('merchant_id', $user->id)->with('merchant')
                ->where('status', 0)->paginate(10);
        }
        // dd($events);
        return Inertia::render('Products/Products', [
            'newProducts' => $newProducts,
            'products' => $products,
            'role' => $role[0]
        ]);
    }

    public function createProduct(Request $req, Product $product, ProductDetail $product_detail)
    {
        $user = $req->user();
        // dd($user);
        if ($req->isMethod('get')) {
            $categories = $this->getProductData();
            $frequency = Frequency::orderBy('sort_order', 'ASC')->get(['id as value', 'frequency as label']);

            return Inertia::render('Products/CreateProduct', [
                'categories' => $categories,
                'frequency' => $frequency
            ]);
        } else {
            // dd($req->post());
            $product = Product::create([
                'merchant_id' => $user->id,
                'product_name' => $req->input('product_name'),
                'product_description' => html_entity_decode(
                    $req->input('product_description'),
                    ENT_QUOTES,
                    'UTF-8'
                ),
                'age_group' => $req->input('age_group'),
                'category_id' => $req->input('category_id'),
            ]);
            ProductDetail::create([
                'product_id' => $product->id,
                'location' => $req->input('event_location'),
                'price' => $req->input('event_price'),
                'google_map_location' => $req->input('event_map_location'),
                'quantity' => $req->input('event_quantity'),
                'event_start_date' =>  date('Y-m-d', strtotime(str_replace('/', '-', $req->input('event_start_date')))),
                'event_end_date' => date(
                    'Y-m-d',
                    strtotime(
                        str_replace('/', '-', $req->input('event_end_date'))
                    )
                ),
                'event_start_time' =>
                $req->input('event_start_time'),
                'event_end_time' =>
                $req->input('event_end_time'),
                'frequency_id' => $req->input('frequency_id'),
            ]);

            return redirect()->back()->with(['success' => "Product Created"]);
        }
    }

    public function newProduct()
    {
        $newProducts = Product::where('status', 1)->get();
        $products = Product::where('status', 0)->orderBy('created', 'DESC')->paginate(10);

        return Inertia::render('Products/CreateProduct', [
            'newProducts' => $newProducts,
            'products' => $products
        ]);
    }

    private function getProductData()
    {
        $categories = (new CategoryController)->categories();
        return $categories;
    }

    public function view(Request $req)
    {
        $product = Product::with('merchant')->find($req->id);
        $product_detail = ProductDetail::where('product_id', $req->id)->first();
        $categories = $this->getProductData();
        $frequency = Frequency::orderBy('sort_order', 'ASC')->get(['id as value', 'frequency as label']);
        $product['product_detail'] = $product_detail;

        return Inertia::render('Products/View', [
            'product' => $product,
            'product_description' => html_entity_decode($product['product_description'], ENT_QUOTES, 'UTF-8'),
            'categories' => $categories,
            'frequency' => $frequency
        ]);
    }

    public function approve(Request $req, Product $product)
    {
        $product = Product::where('id', $req->id)->update([
            'status' => 0
        ]);
    }

    public function reject(Request $req, Product $product)
    {
        $product = Product::where('id', $req->id)->update([
            'status' => 2,
            'reject_comment' => $req->input('rejectText')
        ]);
    }
}
