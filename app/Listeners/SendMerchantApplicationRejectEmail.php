<?php

namespace App\Listeners;

use App\Events\MerchantApplicationReject;
use App\Mail\MerchantApplicationRejectEmail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendMerchantApplicationRejectEmail
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
    public function handle(MerchantApplicationReject $event): void
    {
        Log::info('Merchant rejected mail sent to ' . $event->merchant['merchant_email']);
        $emails = [$event->merchant['merchant_email'], 'merchant.reject@heroes.my'];
        Mail::to($emails)->send(new MerchantApplicationRejectEmail($event->merchant));
    }
}
