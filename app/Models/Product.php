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
        'product_description',
        'status',
        'reject_comment'
    ];

    public function merchant(): BelongsTo
    {
        return $this->belongsTo(Merchant::class, 'merchant_id');
    }

    public function detail(): hasOne
    {
        return $this->hasOne(ProductDetail::class, 'product_id', 'id');
    }
}
