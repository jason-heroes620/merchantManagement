<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MerchantAdditionalInfo extends Model
{
    use HasFactory;

    protected $table = 'merchant_additional_info';
    // protected $primaryKey = 'id';
    protected $connection = 'merchant';
    public $timestamps = false;

    protected $fillable = [
        'merchant_id',
        'facebook',
        'instagram',
        'web',
        'ic_no',
        'company_registration',
        'location'
    ];

    public function merchant(): BelongsTo
    {
        return $this->belongsTo(Merchant::class, 'merchant_id');
    }
}
