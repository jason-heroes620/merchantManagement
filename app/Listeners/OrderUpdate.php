<?php

namespace App\Listeners;

use App\Events\OrderUpdateEvent;
use App\Mail\OrderUpdateEmail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class OrderUpdate
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
    public function handle(OrderUpdateEvent $event): void
    {
        Log::info('Order update mail sent to ' . $event->school['email']);
        $emails = [$event->school['email']];
        $bccEmail = ['jason.w@heroes.my'];

        foreach ($emails as $recipient) {
            Mail::to($recipient)
                ->bcc($bccEmail)
                ->send(new OrderUpdateEmail($event->school, $event->order));
        }
    }
}
