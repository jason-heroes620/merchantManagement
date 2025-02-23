<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderTotal extends Model
{
    use HasFactory;

    protected $connection = 'trip';
    protected $table = 'order_total';
    public $timestamps = false;

    protected $fillable = [
        'order_id',
        'code',
        'title',
        'value',
        'sort_order'
    ];
}
