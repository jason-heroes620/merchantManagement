<?php

namespace App\Listeners;

use App\Events\MerchantApplicationApprove;
use App\Mail\MerchantApplicationApproveEmail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendMerchantApplicationApproveEmail
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
    public function handle(MerchantApplicationApprove $event): void
    {
        Log::info('Merchant approved mail sent to ' . $event->merchant['merchant_email']);
        $emails = [$event->merchant['merchant_email'], 'merchant.approve@heroes.my'];
        Mail::to($emails)->send(new MerchantApplicationApproveEmail($event->merchant));
    }
}
