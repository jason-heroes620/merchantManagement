<?php

namespace App\Models;

use App\Models\Product;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductDetail extends Model
{
    use HasFactory;

    protected $table = 'product_detail';
    protected $connection = 'merchant';
    public $timestamps = false;
    protected $fillable = [
        'product_id',
        'location',
        'price',
        'google_map_location',
        'quantity',
        'event_start_date',
        'event_end_date',
        'event_start_time',
        'event_end_time',
        'frequency_id',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }
}
