<?php

namespace App\Http\Controllers;

use App\Models\Merchant;
use App\Models\Order;
use App\Models\Product;
use App\Models\Quotation;
use App\Models\School;
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

        $schools = 0;
        $quotation_pending = "";
        $quotation_accepted = "";
        $order_paid = "";
        $order_pending = "";

        if ($role[0] === 'admin') {
            $p_reject = Product::selectRaw('COUNT(*) as count')->where('status', 2)->first();
            $p_new = Product::selectRaw('COUNT(*) as count')->where('status', 1)->first();
            $p_current = Product::selectRaw('COUNT(*) as count')->where('status', 0)->first();

            $schools = School::selectRaw('COUNT(*) as count')->where('school_status', 1)->first();
            $quotation_pending = Quotation::selectRaw('COUNT(*) as count')->where('quotation_status', 1)->first();
            $quotation_accepted = Quotation::selectRaw('COUNT(*) as count')->where('quotation_status', 2)->first();

            $order_pending = Order::selectRaw('COUNT(*) as count')->where('order_status', 2)->first();
            $order_paid = Order::selectRaw('COUNT(*) as count')->where('order_status', 2)->first();
        } else {
            $p_reject = Product::selectRaw('COUNT(*) as count')->where('status', 2)->where('merchant_id', $user->id)->first();
            $p_new = Product::selectRaw('COUNT(*) as count')->where('status', 1)->where('merchant_id', $user->id)->first();
            $p_current = Product::selectRaw('COUNT(*) as count')->where('status', 0)->where('merchant_id', $user->id)->first();
        }
        // dd($schools);
        return Inertia::render('Dashboard/Dashboard', [
            'merchant' => [$m_new, $m_current, $m_reject],
            'product' => [$p_new, $p_current, $p_reject],
            'schools' => [$schools],
            'quotations' => [$quotation_pending, $quotation_accepted],
            'orders' => [$order_pending, $order_paid],
        ]);
    }
}
