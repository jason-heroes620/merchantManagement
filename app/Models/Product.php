<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\hasOne;

class Product extends Model
{
    use HasFactory;

    protected $table = 'products';
    protected $connection = 'merchant';
    public $timestamps = false;
    protected $fillable = [
        'merchant_id',
        'product_name',
        'category_id',
        'age_group',
        'location',
        'google_location',
        'child_price',
        'adult_price',
        'duration',
        'product_description',
        'product_activities',
        'product_image',
        'status',
        'reject_comment',
        'min_quantity',
        'max_quantity',
        'food_allowed',
    ];

    public function merchant(): BelongsTo
    {
        return $this->belongsTo(Merchant::class, 'merchant_id', 'id');
    }

    public function detail(): hasOne
    {
        return $this->hasOne(ProductDetail::class, 'product_id', 'id');
    }
}
