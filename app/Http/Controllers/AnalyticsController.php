<?php

namespace App\Http\Controllers;

use App\Models\UserActivity;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    // app/Http/Controllers/AnalyticsController.php
    public function getUserActivity(Request $request)
    {
        $query = UserActivity::query()
            ->with('user')
            ->latest();

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('event_type')) {
            $query->where('event_type', $request->event_type);
        }

        return response()->json([
            'activities' => $query->paginate(25),
            'stats' => [
                'total_activities' => UserActivity::count(),
                'unique_users' => UserActivity::distinct('user_id')->count(),
                'popular_events' => UserActivity::selectRaw('event_name, count(*) as count')
                    ->groupBy('event_name')
                    ->orderByDesc('count')
                    ->limit(5)
                    ->get(),
            ],
        ]);
    }
}
