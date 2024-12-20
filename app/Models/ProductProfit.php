<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductProfit extends Model
{
    use HasFactory;
    protected $table = "product_profit";
    protected $connection = "merchant";

    protected $profit_types = array(
        ['value' => '1', 'label' => "Percentage"],
        ['value' => '2', 'label' => "Fix"]
    );

    protected $fillable = [
        'merchant_id',
        'product_id',
        'profit_type',
        'profit_value',
        'start_date',
        'end_date',
    ];

    public function getProfitTypes()
    {
        return $this->profit_types;
    }
}
