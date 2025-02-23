<?php

namespace App\Listeners;

use App\Events\CreateOrderEvent;
use App\Mail\CreateOrderEmail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class CreateOrder
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
    public function handle(CreateOrderEvent $event): void
    {
        Log::info('Create order mail sent to ' . $event->school['email']);
        $emails = [$event->school['email']];
        $bccEmail = ['jason.w@heroes.my'];
        Mail::to($emails)
            ->bcc($bccEmail)
            ->send(new CreateOrderEmail($event->school, $event->order));
    }
}
