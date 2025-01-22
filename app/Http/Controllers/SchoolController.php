<?php

namespace App\Http\Controllers;

use App\Models\School;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SchoolController extends Controller
{
    public function index(Request $req)
    {
        $schools = School::where('school_status', 0)->paginate(10);
        $new_schools = School::where('school_status', 1)->paginate(10);
        $rejected_schools = School::where('school_status', 2)->paginate(10);

        $type = $req->type;

        return Inertia::render('Schools/Schools', compact('schools', 'new_schools', 'rejected_schools', 'type'));
    }

    public function view(Request $req)
    {
        $school = School::where('school_id', $req->id)->first();

        return Inertia::render('Schools/View', [
            'school' => $school
        ]);
    }
}
