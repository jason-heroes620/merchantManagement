<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProposalProduct extends Model
{
    use HasFactory;

    protected $connection = "trip";
    protected $table = "proposal_product";
    protected $primaryKey = 'proposal_product_id';
    public $timestamps = false;
}
