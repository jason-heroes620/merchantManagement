<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\Chat;
use App\Models\RoomParticipant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class RoomController extends Controller
{
    public function rooms(Request $req)
    {
        $user = $req->user();
        $rooms = Room::leftJoin('room_participants', 'rooms.id', '=', 'room_participants.room_id')
            ->where('room_participants.user_id', '=', $user->id)->get();
        $u = Room::with('user')->first();

        foreach ($rooms as $room) {
            $room['message'] = Chat::where('room_id', $room->id)->latest()->first();
            $room['user'] = $u->user;
        }

        return Inertia::render('Chats/ChatRooms', [
            'rooms' => $rooms
        ]);
    }
}
