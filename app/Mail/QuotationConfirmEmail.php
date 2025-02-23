<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class QuotationConfirmEmail extends Mailable
{
    use Queueable, SerializesModels;
    public $school;
    public $quotation;
    /**
     * Create a new message instance.
     */
    public function __construct($school, $quotation)
    {
        $this->school = $school;
        $this->quotation = $quotation;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Heroes: Your Quotation Request Has Been Accepted',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.quotationConfirm',
            with: ['school', $this->school, 'quotation', $this->quotation]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
