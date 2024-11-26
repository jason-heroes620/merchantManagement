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

    public function createRooms(Request $req)
    {
        $sender = $req->user();
        $receiver_id = $req->sender;
        $room = $this->generateRoomName($sender->id, $receiver_id);

        if (Room::where('room_name', $room)->doesntExist()) {
            $roomId = Room::create([
                'room_name' => $room
            ]);
            return $roomId->id;
        } else {
            $roomId = Room::where('room_name', $room)->first();
            return $roomId->id;
        }
    }

    public function roomsChatUpdate(Request $req)
    {
        Chat::where('room_id', $req->id)->update([
            'seen' => 0
        ]);
        return $this->sendResponse('', '');
    }

    private function generateRoomName($userId1, $userId2)
    {
        $userIds = [$userId1, $userId2];
        sort($userIds);

        return 'room:' . implode(':', $userIds);
    }
}
