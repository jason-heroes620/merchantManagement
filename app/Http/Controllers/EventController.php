<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Role;
use App\Models\Frequency;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use App\Http\Controllers\CategoryController;

class EventController extends Controller
{
    public function events(Request $req): Response
    {
        $user = $req->user();
        $role = $user->roles->pluck('name')->toArray();

        if ($role[0] === 'admin') {
            $newEvents = Event::with('merchant')->where('status', 1)->paginate(10);
            $events = Event::with('merchant')->where('status', 0)->paginate(10);
        } else {
            $newEvents = Event::where('merchant_id', $user->id)->with('merchant')
                ->where('status', 1)->paginate(10);
            $events = Event::where('merchant_id', $user->id)->with('merchant')
                ->where('status', 0)->paginate(10);
        }
        // dd($events);
        return Inertia::render('Events/Events', [
            'newEvents' => $newEvents,
            'events' => $events,
            'role' => $role[0]
        ]);
    }

    public function createEvent(Request $req): Response
    {
        if ($req->isMethod('get')) {
            $categories = $this->getEventData();
            $frequency = Frequency::orderBy('sort_order', 'ASC')->get(['id as value', 'frequency as label']);

            return Inertia::render('Events/CreateEvent', [
                'categories' => $categories,
                'frequency' => $frequency
            ]);
        } else {
        }
    }

    public function newEvent()
    {
        $newEvents = Event::where('status', 1)->get();
        $events = Event::where('status', 0)->orderBy('created', 'DESC')->paginate(10);

        return Inertia::render('Events/CreateEvent', [
            'newEvents' => $newEvents,
            'events' => $events
        ]);
    }

    private function getEventData()
    {
        $categories = (new CategoryController)->categories();
        return $categories;
    }

    public function view(Request $req)
    {
        $event = Event::with('merchant')->find($req->id);
        $event_detail = Event::find($req->id)->detail;
        $categories = $this->getEventData();
        $frequency = Frequency::orderBy('sort_order', 'ASC')->get(['id as value', 'frequency as label']);
        $event['event_detail'] = $event_detail;

        return Inertia::render('Events/View', [
            'event' => $event,
            'event_description' => html_entity_decode($event['event_description'], ENT_QUOTES, 'UTF-8'),
            'categories' => $categories,
            'frequency' => $frequency
        ]);
    }
}
