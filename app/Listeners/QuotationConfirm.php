<?php

namespace App\Listeners;

use App\Events\QuotationConfirmEvent;
use App\Mail\QuotationConfirmEmail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class QuotationConfirm
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
    public function handle(QuotationConfirmEvent $event): void
    {
        Log::info('Quotation confirm mail sent to ' . $event->school['email']);
        $emails = [$event->school['email']];
        $bccEmail = ['jason.w@heroes.my'];

        foreach ($emails as $recipient) {
            Mail::to($recipient)
                ->bcc($bccEmail)
                ->send(new QuotationConfirmEmail($event->school, $event->quotation));
        }
    }
}
