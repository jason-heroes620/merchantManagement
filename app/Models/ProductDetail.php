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
        'sunday_start_time',
        'sunday_end_time',
        'monday_start_time',
        'monday_end_time',
        'tuesday_start_time',
        'tuesday_end_time',
        'wednesday_start_time',
        'wednesday_end_time',
        'thursday_start_time',
        'thursday_end_time',
        'friday_start_time',
        'friday_end_time',
        'saturday_start_time',
        'saturday_end_time',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }
}
