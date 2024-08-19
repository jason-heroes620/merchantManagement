<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Merchant extends Model
{
    use HasFactory;
    protected $table = 'merchant';
    // protected $primaryKey = 'manufacturer_id';
    protected $connection = 'merchant';

    public $timestamps = false;

    protected $fillable = [
        'merchant_name',
        'merchant_phone',
        'merchant_email',
        'merchant_description',
    ];
}
