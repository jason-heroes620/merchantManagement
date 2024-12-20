<?php

namespace App\Http\Controllers;

use App\Models\JourneyMerchant;
use App\Models\Merchant;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;

class JourneyMerchantController extends Controller
{
    public function create(Merchant $merchant)
    {
        $id = JourneyMerchant::where('email', $merchant->merchant_email)->first();

        if (empty($id)) {
            $new = JourneyMerchant::create([
                'name' => $merchant->merchant_name,
                'email' => $merchant->merchant_email,
                'phone' => $merchant->merchant_phone,
                'about' => $merchant->merchant_description,
                'sort_order' => 0
            ]);
            return $new->id;
        } else {
            return $id->manufacturer_id;
        }
    }

    public function getMerchantList()
    {
        $merchants = JourneyMerchant::get();

        return $merchants;
    }

    public function update(Merchant $merchant)
    {
        dd($merchant);
        // $merchant->where('id', $merchant->manufacturer_id)->update([
        //     'name' => $merchant[''],
        // ]);
    }
}
