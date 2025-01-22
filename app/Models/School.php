<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class School extends Model
{
    use HasFactory, HasUuids;

    protected $connection = "trip";
    protected $table = "school";
    protected $primaryKey = 'school_id';
    protected $fillable = [
        'school_id',
        'school_name',
        'address_1',
        'address_2',
        'address_3',
        'postcode',
        'city',
        'state',
        'contact_person',
        'contact_no',
        'mobile_no',
        'email',
        'school_logo',
        'google_map_location',
    ];
}
