<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentDetail extends Model
{
    use HasFactory;

    protected $connection = 'trip';
    protected $table = "payment_details";
    protected $primaryKey = "payment_detail_id";
}
