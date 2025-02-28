<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    protected $connection = 'trip';
    protected $table = 'item';
    public $timestamps = false;

    protected $fillable = [
        'item_code',
        'item_name',
        'item_description',
        'uom',
        'unit_price',
        'additional',
        'additional_unit_cost',
        'sales_tax',
        'item_type',
        'item_image',
        'provider_id',
        'product_id',
    ];
}
