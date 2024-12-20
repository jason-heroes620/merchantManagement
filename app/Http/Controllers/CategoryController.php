<?php

namespace App\Http\Controllers;

use App\Models\Category;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class CategoryController extends Controller
{
    public $allowed_categories = [];

    public function categories()
    {
        $this->allowed_categories = ['Workshop', 'Field Trip'];

        $categories = DB::connection('journey')
            ->table('category')
            ->select('category.category_id as value', 'category_description.name as label')
            ->leftJoin('category_description', 'category.category_id', '=', 'category_description.category_id')
            ->where('category.status', 1)
            ->where('category.parent_id', 0)
            ->whereIn('category_description.name', $this->allowed_categories)
            ->orderBy('category_description.name', 'ASC')
            ->get();

        return $categories;
    }
}
