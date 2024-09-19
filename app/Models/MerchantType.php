<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MerchantType extends Model
{
    use HasFactory;

    protected $table = 'merchant_type';
    protected $connection = 'merchant';
    public $timestamps = false;
}
