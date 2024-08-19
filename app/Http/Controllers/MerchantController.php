<?php

namespace App\Http\Controllers;

use App\Models\Merchant;
use App\Models\MerchantAdditionalInfo;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;

class MerchantController extends Controller
{
    public function merchants(): Response
    {
        $merchants =
            Merchant::select('id', 'merchant_name', 'merchant_email', 'merchant_phone')
            ->where('status', 0)
            ->orderBy('merchant_name', 'ASC')
            ->paginate(10);
        // print_r($merchants);

        $pendingMerchants =
            Merchant::select('id', 'merchant_name', 'merchant_email', 'merchant_phone')
            ->where('status', 1)
            ->orderBy('merchant_name', 'ASC')
            ->paginate(10);
        return Inertia::render('Merchants/Merchants', [
            'merchants' => $merchants,
            'pendingMerchants' => $pendingMerchants
        ]);
    }

    public function view(Request $req)
    {
        $merchant = MerchantAdditionalInfo::with('merchant')->where('merchant_id', $req->id)->first();
        return Inertia::render('Merchants/View', [
            'merchant' => $merchant,
            'merchant_description' => html_entity_decode($merchant['merchant']['merchant_description'], ENT_QUOTES, 'UTF-8')
        ]);
    }

    public function update(Merchant $merchant, MerchantAdditionalInfo $merchantInfo, Request $req): RedirectResponse
    {
        $merchant->update([
            'merchant_name' => $req->name,
            'merchant_email' => $req->email,
            'merchant_phone' => $req->phone,
            'merchant_description' => htmlspecialchars($req->merchant_description),
        ]);

        $merchantInfo->where('merchant_id', $req->id)->update([
            'web' => $req->web,
            'facebook' => $req->facebook,
            'instagram' => $req->instagram,
        ]);

        return Redirect::back()->with(['success' => "Updated Successfully"]);
    }

    public function create(Request $req)
    {
        $merchant = Merchant::create([
            'merchant_name' => $req->input('merchant_name'),
            'merchant_email' => $req->input('email'),
            'merchant_phone' => $req->input('mobile'),
            'merchant_description' => htmlspecialchars(
                $req->input('description')
            ),
        ]);
        // dd($merchant->id);
        MerchantAdditionalInfo::create([
            'merchant_id' => $merchant->id,
            'web' => $req->input('website'),
            'facebook' => $req->input('facebook'),
            'instagram' => $req->input('instagram'),
        ]);

        return redirect()->back()->with(['success' => "Form Submitted"]);
    }

    public function approve(Merchant $merchant, Request $req): RedirectResponse
    {
        $merchant->where('id', $req->id)->update([
            'status' => 0,
        ]);

        return Redirect::back()->with(['success' => "Merchant Approved"]);
    }

    public function reject(Merchant $merchant, Request $req): RedirectResponse
    {
        $merchant->where('id', $req->id)->update([
            'status' => 2,
        ]);

        return Redirect::back()->with(['success' => "Merchant Rejected"]);
    }
}
