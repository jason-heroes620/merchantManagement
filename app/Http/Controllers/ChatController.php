<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;

use App\Models\Chat;
use App\Jobs\SendMessage;
use Inertia\Response;
use Illuminate\Support\Facades\Redirect;
use Pusher\Pusher;
use App\Events\AblyMessageEvent;
use Ably\AblyRest;
use App\Models\Room;
use App\Models\RoomParticipant;
use Illuminate\Support\Facades\Log;


class ChatController extends Controller
{
    public function chats(Request $req)
    {
        $part = RoomParticipant::where('room_id', $req->id)->with('receiver')->get();
        $exist = false;
        if ($part->contains('user_id', auth()->id())) {
            $exist = true;
        }

        if ($exist && count(Room::where('id', $req->id)->get()) > 0) {
            $chats = Chat::where('room_id', $req->id)
                ->with('room')
                ->with('user')
                ->get()
                ->append('createdAt');
            Log::info($chats);
            $receiver = Room::with('user')->first();
            return Inertia::render('Chats/Chats', [
                'chats' => $chats,
                'receiver' => $receiver,
            ]);
        } else {
            return redirect()->route('chatrooms');
        }
    }

    public function messages(): Response
    {
        $chats = Chat::with('user')->get()->append('time');

        return Inertia::render('Chats/Chats', [
            'chats' => $chats
        ]);
    }

    public function createMessage(Request $req)
    {
        $data = $req->post();
        $chat = Chat::create([
            'room_id' => $data['roomId'],
            'user_id' => auth()->id(),
            'type' => 'text',
            'text' => $data['text'],
        ]);
        $chat['user'] = $chat->user()->first();
        $chat['_id'] = $chat->id;
        $chat['createdAt'] = $chat->created_at;

        $client = new AblyRest('V65OGg.kbAMrg:Qvm_880AOYVW1nmm8bFJ_-7WtTR98ooQdyt4_cK47hY');
        $channel = $client->channel('message');
        $channel->publish('AblyMessageEvent', json_encode($chat)); // => true
        $channel->publish('AblyNewMessageEvent', json_encode($chat)); // => true
    }
}
