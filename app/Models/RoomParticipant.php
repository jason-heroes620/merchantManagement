<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class RoomParticipant extends Model
{
    use HasFactory;

    protected $table = 'room_participants';
    public $timestamps = false;

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class, 'room_id');
    }

    // public function user(): HasOne
    // {
    //     return $this->hasOne(User::class, 'user_id');
    // }

    public function receiver(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

    public function user()
    {
        return $this->receiver()
            ->leftJoin('users', 'users.id', '=', 'room_participants.user_id')
            ->where('user_id', '<>', auth()->user()->id);
    }
}
