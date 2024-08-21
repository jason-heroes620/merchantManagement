<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\MerchantController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\EventController;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Artisan;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/merchant-form', function () {
    return Inertia::render('MerchantForm');
})->name('merchant.form');

Route::post('/merchant-register', [MerchantController::class, 'create'])->name('merchant.register');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard/Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Route::get('/merchants', function () {
//     return Inertia::render('Merchants');
// })->middleware(['auth', 'verified'])->name('merchants');

Route::group(['middleware' => ['auth']], function () {
    Route::resource('roles', RoleController::class);
});

// Route::get('/clear-cache', function () {
//     Artisan::call('cache:clear');
//     return "All cache cleared";
// });
// Route::get('/config-clear', function () {
//     Artisan::call('config:clear');
//     return "All config cleared";
// });
// Route::get('/config-cache', function () {
//     Artisan::call('cache:clear');
//     return "All config cache";
// });

Route::get('/reverb-start', function () {
    Artisan::call('reverb:start --port=8080');
    return "Reverb started";
});

// Route::get('/events', function () {
//     return Inertia::render('Events/Events');
// })->middleware(['auth', 'verified'])->name('events');

// Route::get('/events/create', function () {
//     return Inertia::render('Events/CreateEvent');
// })->middleware(['auth', 'verified'])->name('events.create');

Route::middleware('auth')->group(function () {

    Route::post('/chats', [ChatController::class, 'createMessage'])->name('create.message');
    Route::get('/chats', [ChatController::class, 'chats'])->name('chats');

    Route::get('/merchants', [MerchantController::class, 'merchants'])->name('merchants');
    Route::get('/merchants/{id}', [MerchantController::class, 'view'])->name('merchants.view');
    Route::put('/merchants/{merchant}', [MerchantController::class, 'update'])->name('merchants.update');
    Route::put('/merchants/approve/{id}', [MerchantController::class, 'approve'])->name('merchant.approve');
    Route::put('/merchants/reject/{id}', [MerchantController::class, 'reject'])->name('merchant.reject');


    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/events/create', [EventController::class, 'createEvent'])->name('events.create');
    Route::get('/events', [EventController::class, 'events'])->name('events');
    Route::get('/events/{id}', [EventController::class, 'view'])->name('event.view');

    Route::get('/categories', [CategoryController::class, 'categories']);
});

require __DIR__ . '/auth.php';
require __DIR__ . '/channels.php';
