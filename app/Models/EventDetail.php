<?php

namespace App\Models;

use App\Models\Event;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EventDetail extends Model
{
    use HasFactory;

    protected $table = 'event_detail';
    protected $connection = 'merchant';
    public $timestamps = false;

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class, 'event_id', 'id');
    }
}
