<?php

namespace App\Providers;

use App\Events\MerchantApplicationApprove;
use App\Events\NewMerchantApplication;
use App\Listeners\SendNewMerchantApplicationEmail;
use App\Events\NewMerchantApplicationResponse;
use App\Listeners\SendMerchantApplicationApproveEmail;
use App\Listeners\SendNewMerchantApplicationResponseEmail;

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
    }
}
