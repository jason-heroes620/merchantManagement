<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductFilter extends Model
{
    use HasFactory;

    protected $connection = "merchant";
    protected $table = "product_filter";
    protected $primaryKey = "product_filter_id";
    public $timestamps = false;

    protected $fillable = [
        'product_id',
        'filter_id'
    ];
}
