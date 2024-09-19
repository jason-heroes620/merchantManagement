<?php

namespace App\Http\Controllers\API;

use App\Events\NewMessage;
use App\Events\AblyMessageEvent;
use App\Models\Chat;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Jobs\SendMessage;
use Pusher\Pusher;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Room;
use Ably\AblyRest;

class ChatController extends Controller
{
    public function chats(Request $req)
    {
        $chats = Chat::select('chats.type', 'chats.text', 'chats.image', 'chats.id as _id', 'chats.user_id', 'chats.created_at as createdAt')
            ->where('room_id', $req->id)
            ->with('user')
            ->get();
        // $chats = Chat::with('user')->get();
        $data['chats'] = $chats;
        $data['user'] = User::select('id', 'name')->where('id', auth()->id())->first();
        return $this->sendResponse($data, '');
    }

    public function createMessage(Request $req)
    {
        $data = $req->post();
        $chat = Chat::create([
            'user_id' => $data['userId'],
            'room_id' => $data['roomId'],
            'type' => 'text',
            'text' => $data['text'],
        ]);
        $chat['user'] = $chat->user()->first();
        $chat['_id'] = $chat->id;
        $chat['createdAt'] = $chat->created_at;

        $client = new AblyRest('V65OGg.kbAMrg:Qvm_880AOYVW1nmm8bFJ_-7WtTR98ooQdyt4_cK47hY');
        $channel = $client->channel('message');
        $channel->publish('AblyMessageEvent', json_encode($chat)); // => true
        return $this->sendResponse($chat, '');
    }

    public function unreadChats(Request $req)
    {
        $user = $req->user();
        $unread = Chat::where('user_id', $user->id)->where('seen', 1)->count();
        return $this->sendResponse($unread, '');
    }
}
