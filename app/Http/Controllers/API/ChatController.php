<?php

namespace App\Http\Controllers\API;

use App\Models\Chat;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Jobs\SendMessage;

class ChatController extends Controller
{

    public function chats(Request $req)
    {
        $user = $req->user();

        $chats = Chat::with('user')->get()->append('time');
        // print_r($chats);
        return $this->sendResponse($chats, '');
    }

    public function createMessage(Request $req)
    {
        $data = $req->post();
        $chat = Chat::create([
            'user_id' => 1,
            'text' => $data['text'],
        ]);

        SendMessage::dispatch($chat, $chat->user()->first());

        //$chats = Chat::with('user')->get()->append('time');
        return $this->sendResponse($chat, '');
    }
}
