<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Proposal extends Model
{
    use HasFactory;

    protected $connection = 'trip';
    protected $table = "proposal";

    protected $fillable = [
        'proposal_id',
        'user_id',
        'proposal_name',
        'proposal_date',
        'quotation_id',
        'markup_per_student',
        'qty_student',
        'qty_teacher',
        'travel_duration',
        'travel_distance',
        'proposal_status',
        'proposal_version',
        'travel_duration',
        'travel_distance',
        'special_request',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class, 'user_id', 'user_id');
    }
}
