<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ReverbStart extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reverb:start';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Start the Laravel Reverb server';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Reverb server started!');
    }
}
