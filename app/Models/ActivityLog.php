<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    use HasFactory;

    protected $connection = 'activity';
    protected $table = 'activity_log';
    protected $primaryKey = 'activity_log_id';
    protected $fillable = [
        'activity_log_id',
        'user_id',
        'type',
        'app_name',
        'details',
        'created_at',
    ];
    public $timestamps = false;
}
