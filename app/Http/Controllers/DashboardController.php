<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Merchant;
use App\Models\Order;
use App\Models\Product;
use App\Models\Proposal;
use App\Models\ProposalProduct;
use App\Models\School;
use App\Models\User;
use App\Models\UserActivity;
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
        $proposal_pending = 0;
        $order_paid = 0;
        $order_pending = 0;

        $confirmed_current_month = [];
        if ($role[0] === 'admin') {
            $p_reject = Product::selectRaw('COUNT(*) as count')->where('status', 2)->first();
            $p_new = Product::selectRaw('COUNT(*) as count')->where('status', 1)->first();
            $p_current = Product::selectRaw('COUNT(*) as count')->where('status', 0)->first();

            $schools = School::selectRaw('COUNT(*) as count')->where('school_status', 1)->first();
            // $quotation_pending = Quotation::selectRaw('COUNT(*) as count')->where('quotation_status', 1)->first();
            // $quotation_accepted = Quotation::selectRaw('COUNT(*) as count')->where('quotation_status', 2)->first();
            $proposal_pending = Proposal::selectRaw('COUNT(*) as count')->where('proposal_status', 2)->first();

            $order_pending = Order::selectRaw('COUNT(*) as count')->where('order_status', 0)->first();
            $order_paid = Order::selectRaw('COUNT(*) as count')->where('order_status', 2)->first();

            $confirmed_current_month = Order::leftJoin('proposal', 'proposal.proposal_id', 'orders.proposal_id')
                ->leftJoin('school', 'proposal.user_id', 'school.user_id')
                ->where('orders.order_type', 'D')
                ->whereMonth('proposal.proposal_date', now()->month)
                ->whereYear('proposal.proposal_date', now()->year)
                ->get(["school.school_name", "proposal.proposal_date", "proposal.qty_student", "proposal.proposal_id"]);

            foreach ($confirmed_current_month as $c) {
                $locations = [];
                $products = ProposalProduct::where('proposal_id', $c['proposal_id'])->get();
                foreach ($products as $p) {
                    $product = Product::where('id', $p['product_id'])->first();
                    array_push($locations, $product['product_name']);
                }
                $c['locations'] = $locations;
            }
        } else {
            $p_reject = Product::selectRaw('COUNT(*) as count')->where('status', 2)->where('merchant_id', $user->id)->first();
            $p_new = Product::selectRaw('COUNT(*) as count')->where('status', 1)->where('merchant_id', $user->id)->first();
            $p_current = Product::selectRaw('COUNT(*) as count')->where('status', 0)->where('merchant_id', $user->id)->first();

            $current_month = Order::leftJoin('proposal', 'proposal.proposal_id', 'orders.proposal_id')
                ->leftJoin('school', 'proposal.user_id', 'school.user_id')
                ->where('orders.order_type', 'D')
                ->whereMonth('proposal.proposal_date', now()->month)
                ->whereYear('proposal.proposal_date', now()->year)
                ->get(["school.school_name", "proposal.proposal_date", "proposal.qty_student", 'proposal.proposal_id']);

            foreach ($current_month as $c) {
                $products = ProposalProduct::where('proposal_id', $c['proposal_id'])->get();
                foreach ($products as $p) {
                    $product = Product::where('id', $c['product_id'])->where('merchant_id', $user->id)->first();
                    if ($product) {
                        array_push($confirmed_current_month, $c);
                    }
                }
            }
        }

        $query = UserActivity::query();

        if ($req->has('user_id')) {
            $query->where('user_id', $req->user_id);
        }

        if ($req->has('event_type')) {
            $query->where('event_type', $req->event_type);
        }

        // dd($schools);
        return Inertia::render('Dashboard/Dashboard', [
            'merchant' => [$m_new, $m_current, $m_reject],
            'product' => [$p_new, $p_current, $p_reject],
            'schools' => [$schools],
            'proposals' => [$proposal_pending],
            'orders' => [$order_pending, $order_paid],
            'confirmed_current_month' => $confirmed_current_month,
            'activity' => $query->paginate(25),
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

    public function activity(Request $req)
    {
        $user = $req->user();
        $role = $user->roles->pluck('name')->toArray();

        if ($role[0] !== 'admin') {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        // Fetch the activity logs for the specified user
        $topProducts = ActivityLog::where('type', 'product_view')
            ->where('app_name', 'trip')
            ->selectRaw('JSON_EXTRACT(details,"$.product_id") as product_id, COUNT(*) as views')
            ->groupBy('product_id')
            ->orderByDesc('views')
            ->limit(5)
            ->get();
        foreach ($topProducts as $product) {
            $productDetails = Product::where('id', $product->product_id)->first();
            if ($productDetails) {
                $product->product_name = $productDetails->product_name;
            }
        }

        $heatmapData = ActivityLog::selectRaw('HOUR(created_at) as hour, COUNT(*) as count')
            ->where('app_name', 'trip')
            ->groupByRaw('HOUR(created_at)')
            ->orderBy('hour')
            ->get();

        $inactiveUsers = User::whereNotIn('id', function ($query) {
            $query->select('user_id')
                ->from(config('custom.activity_database') . '.activity_log')
                ->whereDate('created_at', '>=', now()->subDays(7));
        })
            ->leftJoin(
                config('custom.account_database') . '.model_has_roles',
                config('acustom.ccount_database') . '.model_has_roles.model_id',
                '=',
                'users.id'
            )->leftJoin(config('custom.trip_database') . '.school', config('custom.trip_database') . '.school.user_id', '=', 'users.id')
            ->where(
                config('custom.account_database') . '.model_has_roles.role_id',
                '=',
                3
            )
            ->get();

        return response()->json([
            'topProducts' => $topProducts,
            'heatmapData' => $heatmapData,
            'inactiveUsers' => $inactiveUsers,
        ]);
    }
}
