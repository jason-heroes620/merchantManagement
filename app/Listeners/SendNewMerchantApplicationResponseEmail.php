<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;
use App\Mail\NewMerchantApplicationResponseEmail;
use Illuminate\Support\Facades\Log;

class SendNewMerchantApplicationResponseEmail
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
    public function handle(object $event): void
    {
        Log::info('Email response sent to ' . $event->merchant['merchant_email']);
        $emails = $event->merchant['merchant_email'];
        Mail::to($emails)->send(new NewMerchantApplicationResponseEmail($event->merchant));
    }
}
