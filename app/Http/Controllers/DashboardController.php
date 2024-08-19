<?php

namespace App\Http\Controllers;

use App\Models\Merchant;
use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    // new merchant and event count
    public function dashboard(): Response
    {
        $merchant = Merchant::where('status', 1)->get();
        $event = Event::where('status', 1)->get();

        return Inertia::render('Dashboard', [
            'merchant' => $merchant,
            'event' => $event
        ]);
    }
}
