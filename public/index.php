<?php

use Ably\AblyRest;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__ . '/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__ . '/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
(require_once __DIR__ . '/../bootstrap/app.php')
    ->handleRequest(Request::capture());

$ably = new AblyRest("{{V65OGg.kbAMrg:Qvm_880AOYVW1nmm8bFJ_-7WtTR98ooQdyt4_cK47hY}}");
