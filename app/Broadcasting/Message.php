<?php

namespace App\Broadcasting;

use Illuminate\Support\Facades\Auth;
use App\Models\User;

class Message
{
    /**
     * Create a new channel instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Authenticate the user's access to the channel.
     */
    public function join(User $user): array|bool
    {
        return Auth::check() && (int) $user->id == Auth::user()->id;
        // return Auth::check();
    }
}
