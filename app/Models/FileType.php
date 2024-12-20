<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FileType extends Model
{
    use HasFactory;
    protected $table = 'file_type';
    protected $connection = 'merchant';
    protected $primaryKey = 'file_type_id';

    public function files(): HasMany
    {
        return $this->hasMany(MerchantFiles::class, 'file_type_id', 'file_type_id');
    }
}
