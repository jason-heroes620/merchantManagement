<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
    use HasFactory;

    protected $table = 'product_images';
    protected $connection = 'merchant';
    public $timestamps = false;
    protected $fillable = [
        'product_id',
        'image_path',
        'original_file_name',
        'product_description',
    ];
}
