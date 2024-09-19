<?php

namespace App\Http\Controllers;

use App\Models\Merchant;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    // new merchant and Product count
    public function dashboard(Request $req): Response
    {
        $user = $req->user();
        $role = $user->roles->pluck('name')->toArray();

        $m_new = Merchant::selectRaw('COUNT(*) as count')->where('status', 1)->first();
        $m_current = Merchant::selectRaw('COUNT(*) as count')->where('status', 0)->first();
        $e_new = 0;
        $e_current = 0;

        if ($role[0] === 'admin') {
            $e_new = Product::selectRaw('COUNT(*) as count')->where('status', 1)->first();
            $e_current = Product::selectRaw('COUNT(*) as count')->where('status', 0)->first();
        } else {
            $e_new = Product::selectRaw('COUNT(*) as count')->where('status', 1)->where('merchant_id', $user->id)->first();
            $e_current = Product::selectRaw('COUNT(*) as count')->where('status', 0)->where('merchant_id', $user->id)->first();
        }

        return Inertia::render('Dashboard/Dashboard', [
            'merchant' => [$m_new, $m_current],
            'product' => [$e_new, $e_current],
        ]);
    }
}
