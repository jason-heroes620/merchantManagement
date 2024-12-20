<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JourneyMerchant extends Model
{
    use HasFactory;

    protected $table = 'manufacturer';
    protected $connection = 'journey';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'image',
        'about',
        'sort_order'
    ];

    public $timestamps = false;
}
