<?php

namespace App\Listeners;

use App\Events\SchoolRejectEvent;
use App\Mail\SchoolRejectEmail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SchoolReject
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(SchoolRejectEvent $event): void
    {
        Log::info('School approved mail sent to ' . $event->school['email']);
        $emails = [$event->school['email']];

        $bccEmail = ['jason.w@heroes.my'];

        foreach ($emails as $recipient) {
            Mail::to($recipient)
                ->bcc($bccEmail)
                ->send(new SchoolRejectEmail($event->school));
        }
    }
}
