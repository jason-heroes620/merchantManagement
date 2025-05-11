<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProposalFiles extends Model
{
    use HasFactory, HasUuids;

    protected $connection = 'trip';
    protected $table = 'proposal_files';
    protected $primaryKey = 'proposal_file_id';
}
