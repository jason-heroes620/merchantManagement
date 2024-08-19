<?php

namespace App\Jobs;

use App\Events\NewMessage;
use App\Models\Chat;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendMessage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(public Chat $message, public User $user)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        NewMessage::dispatch([
            'id' => $this->message->id,
            'user_id' => $this->message->user_id,
            'text' => $this->message->text,
            'time' => $this->message->time,
            'user' => $this->user,
        ]);
    }
}
