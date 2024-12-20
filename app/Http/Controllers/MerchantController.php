<?php

namespace App\Http\Controllers;

use App\Events\MerchantApplicationApprove;
use App\Events\MerchantApplicationReject;
use App\Events\NewMerchantApplication;
use App\Events\NewMerchantApplicationResponse;
use App\Models\Merchant;
use App\Models\MerchantType;
use App\Models\MerchantAdditionalInfo;
use App\Models\MerchantFiles;
use App\Models\ProductProfit;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Exceptions;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Password;

use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;

class MerchantController extends Controller
{
    public function merchants(Request $req): Response
    {
        $merchants =
            Merchant::select('merchants.id', 'merchants.merchant_name', 'merchants.person_in_charge', 'merchants.merchant_email', 'merchants.merchant_phone', 'merchant_type.name as merchant_type')
            ->leftJoin('merchant_type', 'merchants.merchant_type', '=', 'merchant_type.id')
            ->where('merchants.status', 0)
            ->orderBy('merchant_name', 'ASC')
            ->paginate(10);
        // print_r($merchants);

        $pendingMerchants =
            Merchant::select('merchants.id', 'merchants.merchant_name', 'merchants.person_in_charge', 'merchants.merchant_email', 'merchants.merchant_phone', 'merchant_type.name as merchant_type')
            ->leftJoin('merchant_type', 'merchants.merchant_type', '=', 'merchant_type.id')
            ->where('merchants.status', 1)
            ->orderBy('merchant_name', 'ASC')
            ->paginate(10);

        $rejectedMerchants =
            Merchant::select('merchants.id', 'merchants.merchant_name', 'merchants.person_in_charge', 'merchants.merchant_email', 'merchants.merchant_phone', 'merchant_type.name as merchant_type')
            ->leftJoin('merchant_type', 'merchants.merchant_type', '=', 'merchant_type.id')
            ->where('merchants.status', 2)
            ->orderBy('merchant_name', 'ASC')
            ->paginate(10);

        return Inertia::render('Merchants/Merchants', [
            'merchants' => $merchants,
            'pendingMerchants' => $pendingMerchants,
            'rejectedMerchants' => $rejectedMerchants,
            'type' => $req->type
        ]);
    }

    public function view(Request $req)
    {
        // $merchant = MerchantAdditionalInfo::with('merchant')->where('merchant_id', $req->id)->first();
        $merchant = Merchant::where('merchants.id', $req->id)
            ->leftJoin('merchant_additional_info', 'merchants.id', '=', 'merchant_additional_info.merchant_id')
            ->leftJoin('merchant_type', 'merchants.merchant_type', '=', 'merchant_type.id')
            ->first([
                'merchants.*',
                'merchant_additional_info.facebook',
                'merchant_additional_info.instagram',
                'merchant_additional_info.web',
                'merchant_additional_info.ic_no',
                'merchant_additional_info.company_registration',
                'merchant_additional_info.location',
                'merchant_type.type',
                'merchant_type.name',
            ]);

        $types = MerchantType::where('status', 0)->get(['id as value', 'name as label']);

        $files = MerchantFiles::where('merchant_id', $req->id)->get();
        foreach ($files as $file) {
            $file_name = explode("/", $file['file_path']);
            $file['link'] = Storage::url($file_name[sizeof($file_name) - 2] . "/" . $file_name[sizeof($file_name) - 1]);
            $file['type'] = $file->fileType()->first();
        }
        $merchant_logo = $this->getMerchantLogo($merchant['merchant_logo']);

        return Inertia::render('Merchants/View', [
            'merchant' => $merchant,
            'types' => $types,
            'merchant_description' => !empty($merchant['merchant_description']) ? html_entity_decode($merchant['merchant_description'], ENT_QUOTES, 'UTF-8') : '',
            'merchant_files' => $files,
            'merchant_logo' => $merchant_logo,
        ]);
    }

    public function update(Merchant $merchant, MerchantAdditionalInfo $merchantInfo, Request $req): RedirectResponse
    {
        // dd($req);
        $merchant->where('id', $req->id)->update([
            'merchant_type' => $req->input('merchant_type'),
            'merchant_email' => $req->input('merchant_email'),
            'merchant_phone' => $req->input('merchant_phone'),
            'person_in_charge' => $req->input('person_in_charge'),
            'merchant_description' => htmlspecialchars($req->merchant_description),
        ]);

        //merchant_logo
        $merchant_logo = "";
        $fileUtil = new ProductController();
        if ($req->file('merchant_logo') && count($req->file('merchant_logo')) > 0) {
            foreach ($req->file('merchant_logo') as $file) {
                $merchant_logo = storage_path('app/public/merchantLogos');
                $file_name = $fileUtil->randomFileNameGenerator(
                    15,
                    $fileUtil->getFileExtension($file->getClientOriginalName())
                );
                $file->move($merchant_logo, $file_name);

                Merchant::where('id', $req->id)->update([
                    'merchant_logo' => $merchant_logo . '/' . $file_name,
                ]);
            }
        }

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
            'merchant_type' => $req->input('merchantType'),
            'merchant_name' => $req->input('merchant_name'),
            'merchant_email' => $req->input('email'),
            'merchant_phone' => $req->input('mobile'),
            'person_in_charge' => $req->input('person_in_charge'),
            'merchant_description' => htmlspecialchars(
                $req->input('description')
            ),
        ]);

        //merchant_logo
        $merchant_logo = "";
        $fileUtil = new ProductController();
        if ($req->file('merchant_logo') && count($req->file('merchant_logo')) > 0) {
            foreach ($req->file('merchant_logo') as $file) {
                $merchant_logo = storage_path('app/public/merchantLogos');
                $file_name = $fileUtil->randomFileNameGenerator(
                    15,
                    $fileUtil->getFileExtension($file->getClientOriginalName())
                );
                $file->move($merchant_logo, $file_name);

                Merchant::where('id', $merchant->id)->update([
                    'merchant_logo' => $merchant_logo . '/' . $file_name,
                ]);
            }
        }

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
            $path = storage_path('app/public/merchantFiles');
            $file->move($path, $req->file('companyRegistrationForm')->getClientOriginalName());

            MerchantFiles::create([
                'merchant_id' => $merchant->id,
                'file_type' => 'Company Registration Form',
                'file_path' => $path,
                'original_file_name' => $req->file('companyRegistrationForm')->getClientOriginalName()
            ]);
        }

        event(new NewMerchantApplication($merchant));
        event(new NewMerchantApplicationResponse($merchant));
        return redirect()->back()->with(['success' => "Form Submitted"]);
    }

    public function approve(Merchant $merchant, Request $req): RedirectResponse
    {
        try {
            $info = Merchant::find($req->id);
            $password = Str::random(10);

            $user = User::create([
                'name' => $info->person_in_charge,
                'email' => $info->merchant_email,
                'password' => $password,
                'merchant_id' => $req->id
            ]);

            $new_merchant = new JourneyMerchantController;
            $id = $new_merchant->create($info);

            $merchant->where('id', $req->id)->update([
                'status' => 0,
                'manufacturer_id' => $id
            ]);
        } catch (QueryException $e) {
            Log::info($e);
            return
                Redirect::back()->with(['failed' => "A merchant with the email account already exists. Please use another email."]);
        }

        $user->assignRole('Merchant');
        event(new MerchantApplicationApprove($info));
        Password::sendResetLink(
            $user->only('email')
        );
        return Redirect::back()->with(['success' => "Merchant Approved"]);
    }

    public function reject(Merchant $merchant, Request $req): RedirectResponse
    {
        $merchant->where('id', $req->id)->update([
            'status' => 2,
        ]);

        $info = Merchant::find($req->id);
        event(new MerchantApplicationReject($info));
        return Redirect::back()->with(['success' => "Merchant Rejected"]);
    }

    public function fileDownload(Request $req)
    {
        $file = MerchantFiles::where('id', $req->id)->first();
        $file_name = explode('/', $file['file_path']);
        return response()->download(
            public_path("storage/merchantFiles/" . $file_name[sizeof($file_name) - 1])
        );
    }

    public function fileView(Request $req)
    {
        $file = MerchantFiles::where('id', $req->id)->first();
        $file_name = explode('/', $file['file_path']);
        // return response()->file(public_path("storage/merchantFiles/" . $file_name[sizeof($file_name) - 1]));
        $fileMimeType = Storage::mimeType($file["file_path"]);

        return response(storage_path("storage/merchantFiles/" . $file_name[sizeof($file_name) - 1]), 200)
            ->header('Content-Type', $fileMimeType);
    }

    public function fileUpload(Request $req)
    {
        $product = new ProductController();
        if ($req->file('files') && count($req->file('files')) > 0) {
            foreach ($req->file('files') as $file) {
                $file_path = storage_path('app/public/merchantFiles');
                $file_name = $product->randomFileNameGenerator(
                    15,
                    $product->getFileExtension($file->getClientOriginalName())
                );
                $file->move($file_path, $file_name);

                MerchantFiles::create([
                    'merchant_id' => $req->id,
                    'original_file_name' => $file->getClientOriginalName(),
                    'file_path' => $file_path . '/' . $file_name,
                    'file_type_id' => 2
                ]);
            }
        }
        return redirect()->back()->with(['success' => "File(s) uploaded"]);
    }

    public function testMerchantEmail()
    {
        $merchant = Merchant::where('merchants.id', 39)
            ->first(['merchants.*']);

        // event(new NewMerchantApplication($merchant));
        event(new NewMerchantApplicationResponse($merchant));
    }

    private function getMerchantLogo($location)
    {
        $file_name = explode('/', $location);
        $image['url'] = asset('storage/merchantLogos/' . $file_name[sizeof($file_name) - 1]);
        return $image['url'];
    }
}
