<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Role;
use App\Models\Frequency;
use App\Models\ProductDetail;
use App\Models\ProductImage;
use App\Models\ProductProfit;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use App\Http\Controllers\CategoryController;

use function PHPUnit\Framework\isEmpty;
use function PHPUnit\Framework\isNull;

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
            $rejectedProducts = Product::where('merchant_id', $user->merchant_id)->with('merchant')
                ->where('status', 2)->paginate(10);
            $newProducts = Product::where('merchant_id', $user->merchant_id)->with('merchant')
                ->where('status', 1)->paginate(10);
            $products = Product::where('merchant_id', $user->merchant_id)->with('merchant')
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
            $categories = $this->getProductCategories();
            $frequency = Frequency::orderBy('sort_order', 'ASC')->get(['id as value', 'frequency as label']);

            return Inertia::render('Products/CreateProduct', [
                'categories' => $categories,
                'frequency' => $frequency
            ]);
        } else {
            $hours = $req->input('hours') * 60 * 60;
            $minutes = $req->input('minutes') * 60;

            $product = Product::create([
                'merchant_id' => $user->merchant_id,
                'product_name' => $req->input('product_name'),
                'product_description' => html_entity_decode(
                    $req->input('product_description'),
                    ENT_QUOTES,
                    'UTF-8'
                ),
                'product_activities' => html_entity_decode(
                    $req->input('product_activities'),
                    ENT_QUOTES,
                    'UTF-8'
                ),
                'age_group' => $req->input('age_group'),
                'location' => $req->input('location'),
                'child_price' => $req->input('child_price'),
                'adult_price' => $req->input('adult_price'),
                'category_id' => $req->input('category_id'),
                'min_quantity' => $req->input('min_quantity'),
                'max_quantity' => $req->input('max_quantity'),
                'duration' => $hours + $minutes,
                'food_allowed' => $req->input('food_allowed') === 'true' ? 0 : 1,
            ]);

            $main_image_path = "";
            if ($req->file('main_image') && count($req->file('main_image')) > 0) {
                foreach ($req->file('main_image') as $file) {
                    $main_image_path = storage_path('app/public/productImages');
                    $file_name = $this->randomFileNameGenerator(
                        15,
                        $this->getFileExtension($file->getClientOriginalName())
                    );
                    $file->move($main_image_path, $file_name);

                    Product::where('id', $product->id)->update([
                        'product_image' => $main_image_path . '/' . $file_name,
                    ]);
                }
            }

            $week_time = [];
            $index = 0;
            foreach ($req->input('week_time') as $w) {
                $week_time[$index]['start_time'] = $w['start_time'];
                $week_time[$index]['end_time'] = $w['end_time'];
                $index++;
            }

            ProductDetail::create([
                'product_id' => $product->id,
                'google_map_location' => $req->input('google_map_location'),

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
                    $file_name = $this->randomFileNameGenerator(15, $this->getFileExtension($file->getClientOriginalName()));
                    $file->move($path, $file_name);
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_path' => $path . '/' . $file_name,
                        'original_file_name' => $file->getClientOriginalName()
                    ]);
                }
            }

            return redirect()->route('products')->with(['success' => "Product Created"]);
        }
    }

    public function update(Request $req, Product $product, ProductDetail $productDetail)
    {
        $user = $req->user();
        $hours = $req->input('hours') * 60 * 60;
        $minutes = $req->input('minutes') * 60;

        $product->where('id', $req->id)->update([
            'product_name' => $req->product_name,
            'product_description' => html_entity_decode(
                $req->product_description,
                ENT_QUOTES,
                'UTF-8'
            ),
            'product_activities' => html_entity_decode(
                $req->product_activities,
                ENT_QUOTES,
                'UTF-8'
            ),
            'age_group' => $req->age_group,
            'location' => $req->location,
            'child_price' => $req->child_price,
            'adult_price' => $req->adult_price,
            'category_id' => $req->category_id,
            'min_quantity' => $req->min_quantity,
            'max_quantity' => $req->max_quantity,
            'duration' => $hours + $minutes,
            'food_allowed' => $req->input('food_allowed'),
        ]);

        $main_image_path = "";
        if ($req->file('main_image') && count($req->file('main_image')) > 0) {
            foreach ($req->file('main_image') as $file) {
                $main_image_path = storage_path('app/public/productImages');
                $file_name = $this->randomFileNameGenerator(
                    15,
                    $this->getFileExtension($file->getClientOriginalName())
                );
                $file->move($main_image_path, $file_name);

                Product::where('id', $req->id)->update([
                    'product_image' => $main_image_path . '/' . $file_name,
                ]);
            }
        }

        $week_time = [];
        $index = 0;
        foreach ($req->week_time as $w) {
            $week_time[$index]['start_time'] = $w['start_time'];
            $week_time[$index]['end_time'] = $w['end_time'];
            $index++;
        }

        $productDetail->where('product_id', $req->id)->update([
            'product_id' => $req->id,
            'google_map_location' => $req->google_map_location,
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

                $file_name = $this->randomFileNameGenerator(15, $this->getFileExtension($file->getClientOriginalName()));
                $file->move($path, $file_name);
                ProductImage::create([
                    'product_id' => $req->id,
                    'image_path' => $path . '/' . $file_name,
                    'original_file_name' => $file->getClientOriginalName()
                ]);
            }
        }

        return redirect()->back()->with([
            'success' => "Product Updated",
        ]);
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

    private function getProductCategories()
    {
        $categories = (new CategoryController)->categories();
        return $categories;
    }

    public function view(Request $req)
    {
        $product = Product::with('merchant')->find($req->id);
        $product_detail = ProductDetail::where('product_id', $req->id)->first();
        $product_images = $this->getAdditionalProductImages($req->id);
        $categories = $this->getProductCategories();
        $frequency = Frequency::orderBy('sort_order', 'ASC')->get(['id as value', 'frequency as label']);
        $product['product_detail'] = $product_detail;

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
        $duration = $this->getHoursAndMinutes($product['duration']);
        $product['hours'] = $duration['hours'];
        $product['minutes'] = $duration['minutes'];

        $merchant_profit = new ProductProfit();
        $profit_types = $merchant_profit->getProfitTypes();

        $profit_info = ProductProfit::where('product_id', $req->id)->orderBy('end_date', 'desc')->get();

        $main_image = $this->getMainImage($req->id);

        return Inertia::render('Products/View', [
            'product' => $product,
            'product_description' => html_entity_decode($product['product_description'], ENT_QUOTES, 'UTF-8'),
            'product_activities' => html_entity_decode($product['product_activities'], ENT_QUOTES, 'UTF-8'),
            'categories' => $categories,
            'frequency' => $frequency,
            'images' => $product_images,
            'product_main_image' => $main_image,
            'profit_types' => $profit_types,
            'profit_info' => $profit_info,
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

    private function getAdditionalProductImages($product_id)
    {
        $images = ProductImage::where('product_id', $product_id)->get();
        foreach ($images as $p) {
            $file_name = explode('/', $p['image_path']);
            $p['url'] = asset('storage/productImages/' . $file_name[sizeof($file_name) - 1]);
        }
        return $images;
    }

    private function getMainImage($product_id)
    {
        $image = Product::where('id', $product_id)->first()->only(['product_image']);
        // dd($image['product_image']);
        if ($image['product_image']) {
            $file_name = explode('/', $image['product_image']);
            $image['url'] = asset('storage/productImages/' . $file_name[sizeof($file_name) - 1]);

            return $image['url'];
        }
        return;
    }

    public function getFileExtension($file)
    {
        $extension = explode(".", $file);
        return end($extension);
    }

    public function randomFileNameGenerator($length, $extension)
    {
        return substr(str_shuffle(str_repeat($x = '0123456789abcdefghijklmnopqrstuvwxyz', ceil($length / strlen($x)))), 1, $length) . '.' . $extension;
    }

    private function getHoursAndMinutes($duration)
    {
        $hours = floor($duration / 3600);
        $minutes = floor($duration % 3600) / 60;

        return compact('hours', 'minutes');
    }
}
