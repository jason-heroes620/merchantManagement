<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProposalFees extends Model
{
    use HasFactory;

    protected $connection = 'trip';
    protected $table = 'proposal_fees';
    protected $primaryKey = 'proprosal_fee_id';
    public $timestamps = false;

    protected $fillable = [
        'fee_id',
        'fee_amount',
        'fee_type',
        'fee_description',
        'proposal_id',
    ];
}
