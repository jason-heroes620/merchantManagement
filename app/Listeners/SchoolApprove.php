<?php

namespace App\Listeners;

use App\Events\SchoolApproveEvent;
use App\Mail\SchoolApproveEmail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SchoolApprove
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
    public function handle(SchoolApproveEvent $event): void
    {
        Log::info('School approved mail sent to ' . $event->school['email']);
        $emails = [$event->school['email'], 'jason.w@heroes.my'];
        Mail::to($emails)->send(new SchoolApproveEmail($event->school));
    }
}
