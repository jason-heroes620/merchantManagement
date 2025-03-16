<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Discount extends Model
{
    use HasFactory;

    protected $connection = 'trip';
    protected $table = "discount";
    protected $primaryKey = "discount_id";

    protected $fillable = [
        'proposal_id',
        'discount_type',
        'discount_amount',
    ];
}
