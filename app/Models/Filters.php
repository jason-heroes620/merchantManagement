<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Filters extends Model
{
    use HasFactory;

    protected $connection = "merchant";
    protected $table = "filters";
    protected $primaryKey = "filter_id";

    protected $fillable = [
        'filter_name',
        'filter_description',
        'filter_status'
    ];
}
