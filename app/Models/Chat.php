<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Chat extends Model
{
    use HasFactory;

    protected $table = 'chats';
    protected $fillable = ['room_id', 'user_id', 'type', 'image', 'text', 'seen'];

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class, 'room_id');
    }

    public function user(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'user_id')->select(['id', 'id as _id', 'name']);
    }

    public function lastMessage(int $room_id): Chat
    {
        return Chat::where('room_id', $room_id)->latest()->first();
    }

    public function getTimeAttribute(): string
    {
        return date(
            "d M Y, H:i",
            strtotime($this->attributes['created_at'])
        );
    }
}
