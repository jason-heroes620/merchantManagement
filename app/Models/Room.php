<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Room extends Model
{
    use HasFactory;
    public $timestamps = false;

    public function chat(): HasMany
    {
        return $this->hasMany(Chat::class, 'room_id', 'id');
    }

    public function participant(): HasOne
    {
        return $this->hasOne(RoomParticipant::class,  'room_id', 'id')->select(['room_id', 'user_id', 'name', 'email']);
    }

    public function user()
    {
        return $this->participant()
            ->leftJoin('users', 'users.id', '=', 'room_participants.user_id')
            ->where('user_id', '<>', auth()->user()->id);
    }
}
