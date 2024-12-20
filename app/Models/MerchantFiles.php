<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class MerchantFiles extends Model
{
    use HasFactory;

    protected $table = 'merchant_files';
    protected $connection = 'merchant';
    public $timestamps = false;

    protected $fillable = [
        'merchant_id',
        'file_type_id',
        'original_file_name',
        'file_path'
    ];

    public function merchant(): BelongsTo
    {
        return $this->belongsTo(Merchant::class, 'merchant_id');
    }

    public function fileType(): BelongsTo
    {
        return $this->belongsTo(FileType::class, 'file_type_id');
    }
}
