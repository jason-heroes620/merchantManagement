<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserActivity extends Model
{
    use HasFactory;

    protected $connection = 'trip';
    protected $table = 'user_activities';
    protected $primaryKey = 'id';
}
