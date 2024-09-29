<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Role;
use App\Models\Frequency;
use App\Models\ProductDetail;
use App\Models\ProductImage;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use App\Http\Controllers\CategoryController;


class ProductController extends Controller
{
    public function products(Request $req): Response
    {
        $user = $req->user();
        $role = $user->roles->pluck('name')->toArray();

        if ($role[0] === 'admin') {
            $rejectedProducts = Product::with('merchant')->where('status', 2)->paginate(10);
            $newProducts = Product::with('merchant')->where('status', 1)->paginate(10);
            $products = Product::with('merchant')->where('status', 0)->paginate(10);
        } else {
            $rejectedProducts = Product::where('merchant_id', $user->id)->with('merchant')
                ->where('status', 2)->paginate(10);
            $newProducts = Product::where('merchant_id', $user->id)->with('merchant')
                ->where('status', 1)->paginate(10);
            $products = Product::where('merchant_id', $user->id)->with('merchant')
                ->where('status', 0)->paginate(10);
        }
        // dd($events);
        return Inertia::render('Products/Products', [
            'newProducts' => $newProducts,
            'products' => $products,
            'rejectedProducts' => $rejectedProducts,
            'role' => $role[0],
            'type' => $req->type,
        ]);
    }

    public function createProduct(Request $req, Product $product)
    {
        $user = $req->user();

        if ($req->isMethod('get')) {
            $categories = $this->getProductData();
            $frequency = Frequency::orderBy('sort_order', 'ASC')->get(['id as value', 'frequency as label']);

            return Inertia::render('Products/CreateProduct', [
                'categories' => $categories,
                'frequency' => $frequency
            ]);
        } else {
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

            $week_time = [];
            $index = 0;
            foreach ($req->input('week_time') as $w) {
                $week_time[$index]['start_time'] = $w['start_time'];
                $week_time[$index]['end_time'] = $w['end_time'];
                $index++;
            }

            ProductDetail::create([
                'product_id' => $product->id,
                'location' => $req->input('location'),
                'price' => $req->input('price'),
                'google_map_location' => $req->input('google_map_location'),
                'quantity' => $req->input('quantity'),
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

                'sunday_start_time' => $week_time[0]['start_time'],
                'sunday_end_time' => $week_time[0]['end_time'],
                'monday_start_time' => $week_time[1]['start_time'],
                'monday_end_time' => $week_time[1]['end_time'],
                'tuesday_start_time' => $week_time[2]['start_time'],
                'tuesday_end_time' => $week_time[2]['end_time'],
                'wednesday_start_time' => $week_time[3]['start_time'],
                'wednesday_end_time' => $week_time[3]['end_time'],
                'thursday_start_time' => $week_time[4]['start_time'],
                'thursday_end_time' => $week_time[4]['end_time'],
                'friday_start_time' => $week_time[5]['start_time'],
                'friday_end_time' => $week_time[5]['end_time'],
                'saturday_start_time' => $week_time[6]['start_time'],
                'saturday_end_time' => $week_time[6]['end_time'],
            ]);

            if ($req->file('images') && count($req->file('images')) > 0) {
                foreach ($req->file('images') as $file) {
                    $path = storage_path('app/public/productImages');
                    $file->move($path, $file->getClientOriginalName());

                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_path' => $path,
                        'original_file_name' => $file->getClientOriginalName()
                    ]);
                }
            }

            return redirect()->back()->with(['success' => "Product Created"]);
        }
    }

    public function update(Request $req, Product $product, ProductDetail $productDetail)
    {
        $user = $req->user();
        $product->where('id', $req->id)->update([
            'product_name' => $req->product_name,
            'product_description' => html_entity_decode(
                $req->product_description,
                ENT_QUOTES,
                'UTF-8'
            ),
            'age_group' => $req->age_group,
            'category_id' => $req->category_id,
        ]);

        $week_time = [];
        $index = 0;
        foreach ($req->week_time as $w) {
            $week_time[$index]['start_time'] = $w['start_time'];
            $week_time[$index]['end_time'] = $w['end_time'];
            $index++;
        }

        $productDetail->where('product_id', $req->id)->update([
            'product_id' => $req->id,
            'location' => $req->location,
            'price' => $req->price,
            'google_map_location' => $req->google_map_location,
            'quantity' => $req->quantity,
            'event_start_date' =>  date('Y-m-d', strtotime(str_replace('/', '-', $req->event_start_date))),
            'event_end_date' => date(
                'Y-m-d',
                strtotime(
                    str_replace('/', '-', $req->event_end_date)
                )
            ),
            'event_start_time' =>
            $req->event_start_time,
            'event_end_time' =>
            $req->event_end_time,
            'frequency_id' => $req->frequency_id,
            'sunday_start_time' => $week_time[0]['start_time'],
            'sunday_end_time' => $week_time[0]['end_time'],
            'monday_start_time' => $week_time[1]['start_time'],
            'monday_end_time' => $week_time[1]['end_time'],
            'tuesday_start_time' => $week_time[2]['start_time'],
            'tuesday_end_time' => $week_time[2]['end_time'],
            'wednesday_start_time' => $week_time[3]['start_time'],
            'wednesday_end_time' => $week_time[3]['end_time'],
            'thursday_start_time' => $week_time[4]['start_time'],
            'thursday_end_time' => $week_time[4]['end_time'],
            'friday_start_time' => $week_time[5]['start_time'],
            'friday_end_time' => $week_time[5]['end_time'],
            'saturday_start_time' => $week_time[6]['start_time'],
            'saturday_end_time' => $week_time[6]['end_time'],
        ]);

        if ($req->file('images') && count($req->file('images')) > 0) {
            foreach ($req->file('images') as $file) {
                $path = storage_path('app/public/productImages');
                $file->move($path, $file->getClientOriginalName());

                ProductImage::create([
                    'product_id' => $req->id,
                    'image_path' => $path,
                    'original_file_name' => $file->getClientOriginalName()
                ]);
            }
        }

        return redirect()->back()->with(['success' => "Product Updated"]);
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
        $product_images = ProductImage::where('product_id', $req->id)->get();
        $categories = $this->getProductData();
        $frequency = Frequency::orderBy('sort_order', 'ASC')->get(['id as value', 'frequency as label']);
        $product['product_detail'] = $product_detail;

        foreach ($product_images as $p) {
            $p['url'] = asset('storage/productImages/' . $p['original_file_name']);
        }

        $week_time = [];
        $week_time[0]['index'] = 0;
        $week_time[0]['start_time'] = $product_detail['sunday_start_time'] ?? '';
        $week_time[0]['end_time']   = $product_detail['sunday_end_time'] ?? '';
        $week_time[1]['index'] = 1;
        $week_time[1]['start_time'] = $product_detail['monday_start_time'] ?? '';
        $week_time[1]['end_time']   = $product_detail['monday_end_time'] ?? '';
        $week_time[2]['index'] = 2;
        $week_time[2]['start_time'] = $product_detail['tuesday_start_time'] ?? '';
        $week_time[2]['end_time']   = $product_detail['tuesday_end_time'] ?? '';
        $week_time[3]['index'] = 3;
        $week_time[3]['start_time'] = $product_detail['wednesday_start_time'] ?? '';
        $week_time[3]['end_time']   = $product_detail['wednesday_end_time'] ?? '';
        $week_time[4]['index'] = 4;
        $week_time[4]['start_time'] = $product_detail['thursday_start_time'] ?? '';
        $week_time[4]['end_time']   = $product_detail['thursday_end_time'] ?? '';
        $week_time[5]['index'] = 5;
        $week_time[5]['start_time'] = $product_detail['friday_start_time'] ?? '';
        $week_time[5]['end_time']   = $product_detail['friday_end_time'] ?? '';
        $week_time[6]['index'] = 6;
        $week_time[6]['start_time'] = $product_detail['saturday_start_time'] ?? '';
        $week_time[6]['end_time']   = $product_detail['saturday_end_time'] ?? '';

        $product['week_time'] = $week_time;

        return Inertia::render('Products/View', [
            'product' => $product,
            'product_description' => html_entity_decode($product['product_description'], ENT_QUOTES, 'UTF-8'),
            'categories' => $categories,
            'frequency' => $frequency,
            'images' => $product_images,
        ]);
    }

    public function approve(Request $req)
    {
        Product::where('id', $req->id)->update([
            'status' => 0
        ]);

        return redirect()->back()->with(['success' => "Product Approved"]);
    }

    public function reject(Request $req)
    {
        Product::where('id', $req->id)->update([
            'status' => 2,
            'reject_comment' => $req->input('rejectText')
        ]);

        return redirect()->back()->with(['success' => "Product Rejected"]);
    }
}
