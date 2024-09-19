<?php

namespace App\Http\Controllers;

use App\Models\Merchant;
use App\Models\MerchantType;
use App\Models\MerchantAdditionalInfo;
use App\Models\MerchantFiles;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;

class MerchantController extends Controller
{
    public function merchants(): Response
    {
        $merchants =
            Merchant::select('merchants.id', 'merchants.merchant_name', 'merchants.merchant_email', 'merchants.merchant_phone', 'merchant_type.name as merchant_type')
            ->leftJoin('merchant_type', 'merchants.merchant_type', '=', 'merchant_type.id')
            ->where('merchants.status', 0)
            ->orderBy('merchant_name', 'ASC')
            ->paginate(10);
        // print_r($merchants);

        $pendingMerchants =
            Merchant::select('merchants.id', 'merchants.merchant_name', 'merchants.merchant_email', 'merchants.merchant_phone', 'merchant_type.name as merchant_type')
            ->leftJoin('merchant_type', 'merchants.merchant_type', '=', 'merchant_type.id')
            ->where('merchants.status', 1)
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
        $merchant = Merchant::where('merchants.id', $req->id)
            ->leftJoin('merchant_additional_info', 'merchants.id', '=', 'merchant_additional_info.merchant_id')
            ->leftJoin('merchant_type', 'merchants.merchant_type', '=', 'merchant_type.id')
            ->first(['merchants.*', 'merchant_additional_info.*', 'merchant_type.type', 'merchant_type.name']);

        $types = MerchantType::where('status', 0)->get(['id as value', 'name as label']);

        $files = MerchantFiles::where('merchant_id', $req->id)->get();
        foreach ($files as $file) {
            $file['link'] = Storage::url($file['original_file_name']);
        }

        return Inertia::render('Merchants/View', [
            'merchant' => $merchant,
            'types' => $types,
            'merchant_description' => !empty($merchant['merchant_description']) ? html_entity_decode($merchant['merchant_description'], ENT_QUOTES, 'UTF-8') : '',
            'merchant_files' => $files,
        ]);
    }

    public function update(Merchant $merchant, MerchantAdditionalInfo $merchantInfo, Request $req): RedirectResponse
    {
        $merchant->update([
            'merchant_type' => $req->input('merchant_type'),
            'merchant_name' => $req->merchant_name,
            'merchant_email' => $req->merchant_email,
            'merchant_phone' => $req->merchant_phone,
            'merchant_description' => htmlspecialchars($req->merchant_description),
        ]);

        $merchantInfo->where('merchant_id', $req->id)->update([
            'web' => $req->input('web'),
            'facebook' => $req->input('facebook'),
            'instagram' => $req->input('instagram'),
            'company_registration' => $req->input('company_registration')
        ]);

        return Redirect::back()->with(['success' => "Updated Successfully"]);
    }

    public function create(Request $req)
    {
        $merchant = Merchant::create([
            'merchant_type' => MerchantType::where('type', $req->input('merchant_type'))->first(),
            'merchant_name' => $req->input('merchant_name'),
            'merchant_email' => $req->input('email'),
            'merchant_phone' => $req->input('mobile'),
            'merchant_description' => htmlspecialchars(
                $req->input('description')
            ),
        ]);

        MerchantAdditionalInfo::create([
            'merchant_id' => $merchant->id,
            'web' => $req->input('website'),
            'facebook' => $req->input('facebook'),
            'instagram' => $req->input('instagram'),
            'location' => $req->input('location'),
            'company_registration' => $req->input('companyRegistration')
        ]);

        if (!empty($req->file('companyRegistrationForm'))) {
            $file = $req->file('companyRegistrationForm');
            $path = storage_path('app/public/companyRegistrationForm');
            $file->move($path, $req->file('companyRegistrationForm')->getClientOriginalName());

            MerchantFiles::create([
                'merchant_id' => $merchant->id,
                'file_type' => 'Company Registration Form',
                'file_path' => $path,
                'original_file_name' => $req->file('companyRegistrationForm')->getClientOriginalName()
            ]);
        }


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

    public function fileDownload(Request $req)
    {
        $file = MerchantFiles::where('id', $req->id)->first();
        return response()->download(
            public_path('storage/companyRegistrationForm/' . $file['original_file_name'], $file['original_file_name'])
        );
    }
}
