<?php

namespace App\Http\Controllers;

use App\Events\SchoolApproveEvent;
use App\Events\SchoolRejectEvent;
use App\Models\School;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Exceptions;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Password;

class SchoolController extends Controller
{
    public function index(Request $req)
    {
        $type = $req->input('tab', 'pending');

        $schools = School::where('school_status', 0)->paginate(
            10,
            ['*'],
            'CurrentPage'
        )->appends(['tab' => 'current']);
        $new_schools = School::where('school_status', 1)->paginate(
            10,
            ['*'],
            'PendingPage'
        )->appends(['tab' => 'pending']);
        $rejected_schools = School::where('school_status', 2)->paginate(
            10,
            ['*'],
            'RejectedPage'
        )->appends(['tab' => 'rejected']);

        $type = $type;

        return Inertia::render('Schools/Schools', compact('schools', 'new_schools', 'rejected_schools', 'type'));
    }

    public function view(Request $req)
    {
        $school = School::where('school_id', $req->id)->first();
        $logo = $this->getSchoolLogo($school['school_id']);

        return Inertia::render('Schools/View', [
            'school' => $school,
            'school_logo' => $logo
        ]);
    }

    public function update(Request $req)
    {
        $school = School::where('school_id', $req->id)->update([
            'school_id' => $req->id,
            'school_name' => $req->input('school_name'),
            'address_1' => $req->input('address_1'),
            'address_2' => $req->input('address_2'),
            'address_3' => $req->input('address_3'),
            'city' => $req->input('city'),
            'postcode' => $req->input('postcode'),
            'state' => $req->input('state'),
            'contact_person' => $req->input('contact_person'),
            'contact_no' => $req->input('contact_no'),
            'mobile_no' => $req->input('mobile_no'),
            'email' => $req->input('email'),
            'google_place_name' => $req->input('google_place_name'),
        ]);

        return redirect()->back();
    }

    public function approve(Request $req)
    {
        try {
            $school = School::where('school_id', $req->id)->first();
            $user = User::where('email', $school['email'])->get();
            if (count($user) > 0) {
                $data['error'] = 'The email account already exist, user account cannot be created.';
                return response()->json($data);
            } else {
                School::where('school_id', $req->id)->update([
                    'school_status' => 0
                ]);
                $password = Str::random(10);
                $user = User::create([
                    'name' => $school->contact_person,
                    'email' => $school->email,
                    'password' => $password,
                    'school_id' => $req->id
                ]);
                $user->assignRole('School');
                event(new SchoolApproveEvent($school));
                Http::post(config('custom.trip_host') . 'api/sendPasswordResetLink', $user);
                // Password::sendResetLink(
                //     $user->only('email')
                // );
                School::where('school_id', $req->id)->update([
                    'user_id' => $user->id
                ]);
                // create account , send email, password reset link
                $data['success'] = 'Account is approved & created';
                return response()->json($data);
            }
        } catch (Exceptions $e) {
            Log::error("school approve error: " . $e);
            $data['error'] = "There was an error with approval.";
            return response()->json($data);
        }
    }

    public function reject(Request $req)
    {
        try {
            $school = School::where('school_id', $req->id)->first();
            School::where('school_id', $req->id)->update([
                'school_status' => 2
            ]);
            $data['success'] = "The application has been set as rejected.";
            event(new SchoolRejectEvent($school));

            return response()->json($data);
        } catch (Exceptions $e) {
            Log::error("school reject error: " . $e);
            $data['error'] = "There was an error with reject.";
            return response()->json($data);
        }
    }

    private function getSchoolLogo($school_id)
    {
        $image = School::where('school_id', $school_id)->first()->only(['school_logo']);
        // dd($image['product_image']);
        if ($image['school_logo']) {
            $file_name = explode('/', $image['school_logo']);
            // $image['url'] = asset('storage/schoolLogos/' . $file_name[sizeof($file_name) - 1]);
            $image['url'] = config('custom.trip_host') . 'storage/schoolLogos/' . $file_name[sizeof($file_name) - 1];
            return $image['url'];
        }
        return;
    }
}
