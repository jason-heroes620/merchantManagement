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

        $m_reject = Merchant::selectRaw('COUNT(*) as count')->where('status', 2)->first();
        $m_new = Merchant::selectRaw('COUNT(*) as count')->where('status', 1)->first();
        $m_current = Merchant::selectRaw('COUNT(*) as count')->where('status', 0)->first();

        $p_reject = 0;
        $p_new = 0;
        $p_current = 0;

        if ($role[0] === 'admin') {
            $p_reject = Product::selectRaw('COUNT(*) as count')->where('status', 2)->first();
            $p_new = Product::selectRaw('COUNT(*) as count')->where('status', 1)->first();
            $p_current = Product::selectRaw('COUNT(*) as count')->where('status', 0)->first();
        } else {
            $p_reject = Product::selectRaw('COUNT(*) as count')->where('status', 2)->where('merchant_id', $user->id)->first();
            $p_new = Product::selectRaw('COUNT(*) as count')->where('status', 1)->where('merchant_id', $user->id)->first();
            $p_current = Product::selectRaw('COUNT(*) as count')->where('status', 0)->where('merchant_id', $user->id)->first();
        }

        return Inertia::render('Dashboard/Dashboard', [
            'merchant' => [$m_new, $m_current, $m_reject],
            'product' => [$p_new, $p_current, $p_reject],
        ]);
    }
}
