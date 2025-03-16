<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReservedDate extends Model
{
    use HasFactory;

    protected $connection = 'trip';
    protected $table = 'reserved_dates';
    protected $primaryKey = 'reserved_date_id';

    protected $fillable = [
        'reserved_date',
        'user_id',
        'product_id',
        'reserved_date_status',
    ];
}
