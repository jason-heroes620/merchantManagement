<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quotation extends Model
{
    use HasFactory, HasUuids;
    protected $connection = 'trip';
    protected $table = "quotation";
    protected $primaryKey = "quotation_id";
}
