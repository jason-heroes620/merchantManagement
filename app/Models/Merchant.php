<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Merchant extends Model
{
    use HasFactory;
    protected $table = 'merchants';
    // protected $primaryKey = 'manufacturer_id';
    protected $connection = 'merchant';

    const CREATED_AT = 'created';
    const UPDATED_AT = null;

    protected $fillable = [
        'merchant_type',
        'merchant_name',
        'merchant_phone',
        'merchant_email',
        'merchant_description',
    ];
}
