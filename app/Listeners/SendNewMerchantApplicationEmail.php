<?php

namespace App\Listeners;

use App\Events\NewMerchantApplication;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;
use App\Mail\NewMerchantApplicationEmail;
use Illuminate\Support\Facades\Log;


class SendNewMerchantApplicationEmail
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
        Log::info('New Merchant Application Received email sent to ' . $event->merchant['merchant_email']);
        $emails = [$event->merchant['merchant_email'], 'merchant.application@heroes.my'];
        Mail::to($emails)->send(new NewMerchantApplicationEmail($event->merchant));
    }
}
