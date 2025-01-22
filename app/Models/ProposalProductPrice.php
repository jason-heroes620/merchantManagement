<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProposalProductPrice extends Model
{
    use HasFactory;

    protected $connection = "trip";
    protected $table = "proposal_product_price";
    protected $primaryKey = 'product_price_id';
    public $timestamps = false;
}
