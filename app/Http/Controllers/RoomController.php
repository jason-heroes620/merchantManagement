<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\Chat;
use App\Models\RoomParticipant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoomController extends Controller
{
    public function rooms(Request $req)
    {
        $user = $req->user();
        $rooms = Room::with('user')->get();

        foreach ($rooms as $room) {
            $room['message'] = Chat::where('room_id', $room->id)->latest()->first();
        }

        return Inertia::render('Chats/ChatRooms', [
            'rooms' => $rooms
        ]);
    }
}
