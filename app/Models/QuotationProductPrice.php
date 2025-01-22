<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuotationProductPrice extends Model
{
    use HasFactory;

    protected $connection = 'trip';
    protected $table = 'quotation_product_price';
    protected $primaryKey = 'product_price_id';

    protected $fillable = [
        'quotation_product_id',
        'uom',
        'attribute',
        'unit_price',
        'qty',
        'sales_tax',
    ];

    public $timestamps = false;
}
