<?php

namespace App\Http\Controllers;

use App\Models\ProductImage;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class ProductImageController extends Controller
{
    public function delete(Request $req)
    {
        $image = ProductImage::findOrFail($req->id);
        $path = storage_path('app/public/productImages/' . $image->original_file_name);

        if (File::exists($path))
            File::delete($path);

        $image->delete();

        return redirect()->back()->with(['success' => "Image has been deleted"]);
    }
}
