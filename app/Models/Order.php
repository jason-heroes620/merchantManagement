<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'orders';
    protected $connection = 'trip';
    protected $primaryKey = 'order_id';
    protected $fillable = [
        'order_id',
        'quotation_id',
        'user_id',
        'order_no',
        'order_date',
        'order_amount',
        'due_date',
        'order_status',
        'order_type',
        'proposal_id',
        'order_description'
    ];
}
