<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\hasOne;

class Event extends Model
{
    use HasFactory;

    protected $table = 'event';
    protected $connection = 'merchant';
    public $timestamps = false;
    protected $fillable = [
        'event_id',
        'event_name',
        'event_description',
    ];

    public function merchant(): BelongsTo
    {
        return $this->belongsTo(Merchant::class, 'merchant_id');
    }

    public function detail(): hasOne
    {
        return $this->hasOne(EventDetail::class, 'event_id', 'id');
    }
}
