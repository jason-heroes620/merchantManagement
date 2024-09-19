<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Room;
use App\Models\Chat;

class RoomController extends Controller
{
    public function rooms(Request $req)
    {
        $user = $req->user();
        $rooms = Room::with('user')->get();

        foreach ($rooms as $room) {
            $room['message'] = Chat::where('room_id', $room->id)->latest()->first();
            $room['unread'] = Chat::where('room_id', $room->id)->where('seen', 1)->count();
        }

        return $this->sendResponse($rooms, '');
    }

    public function roomsChatUpdate(Request $req)
    {
        Chat::where('room_id', $req->id)->update([
            'seen' => 0
        ]);
        return $this->sendResponse('', '');
    }
}
