<?php

namespace App\Providers;

use App\Events\CreateOrderEvent;
use App\Events\MerchantApplicationApprove;
use App\Events\MerchantApplicationReject;
use App\Events\NewMerchantApplication;
use App\Listeners\SendNewMerchantApplicationEmail;
use App\Events\NewMerchantApplicationResponse;
use App\Events\QuotationConfirmEvent;
use App\Events\SchoolApproveEvent;
use App\Events\SchoolRejectEvent;
use App\Listeners\CreateOrder;
use App\Listeners\QuotationConfirm;
use App\Listeners\SendMerchantApplicationApproveEmail;
use App\Listeners\SendMerchantApplicationRejectEmail;
use App\Listeners\SendNewMerchantApplicationResponseEmail;
use App\Listeners\SchoolApprove;
use App\Listeners\SchoolReject;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Event::listen(
            NewMerchantApplication::class,
            SendNewMerchantApplicationEmail::class,
        );

        Event::listen(
            NewMerchantApplicationResponse::class,
            SendNewMerchantApplicationResponseEmail::class,
        );

        Event::listen(
            MerchantApplicationApprove::class,
            SendMerchantApplicationApproveEmail::class,
        );

        Event::listen(
            MerchantApplicationReject::class,
            SendMerchantApplicationRejectEmail::class,
        );

        Event::listen(
            SchoolApproveEvent::class,
            SchoolApprove::class,
        );

        Event::listen(
            SchoolRejectEvent::class,
            SchoolReject::class
        );

        Event::listen(
            QuotationConfirmEvent::class,
            QuotationConfirm::class
        );

        Event::listen(
            CreateOrderEvent::class,
            CreateOrder::class,
        );
    }
}
