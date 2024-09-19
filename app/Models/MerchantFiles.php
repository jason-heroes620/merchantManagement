<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MerchantFiles extends Model
{
    use HasFactory;

    protected $table = 'merchant_files';
    protected $connection = 'merchant';
    public $timestamps = false;

    protected $fillable = [
        'merchant_id',
        'file_type',
        'original_file_name',
        'file_path'
    ];

    public function merchant(): BelongsTo
    {
        return $this->belongsTo(Merchant::class, 'merchant_id');
    }
}
