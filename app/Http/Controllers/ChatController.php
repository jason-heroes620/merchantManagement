<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;

use App\Models\Chat;
use App\Jobs\SendMessage;
use Inertia\Response;
use Illuminate\Support\Facades\Redirect;

class ChatController extends Controller
{
    public function chats(Request $req)
    {
        $user = $req->user();

        $chats = Chat::with('user')->get()->append('time');
        // print_r($chats);
        return Inertia::render('Chats/Chats', [
            'chats' => $chats
        ]);
    }

    public function messages(): Response
    {
        $chats = Chat::with('user')->get()->append('time');

        return Inertia::render('Chats/Chats', [
            'chats' => $chats
        ]);
    }

    public function createMessage(Request $request)
    {
        $chat = Chat::create([
            'user_id' => auth()->id(),
            'text' => $request->get('text'),
        ]);
        SendMessage::dispatch($chat, $chat->user()->first());
    }
}
