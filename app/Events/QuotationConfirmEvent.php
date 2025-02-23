<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class QuotationConfirmEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public $school;
    public $quotation;
    /**
     * Create a new event instance.
     */
    public function __construct($school, $quotation)
    {
        $this->school = $school;
        $this->quotation = $quotation;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('quotation-confirm'),
        ];
    }
}
