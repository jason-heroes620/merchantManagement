<?php

use App\Models\MerchantType;

use App\Http\Controllers\RoomController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MerchantController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ProductController;

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
    $types = MerchantType::where('status', 0)->get();
    return Inertia::render('MerchantForm/MerchantForm', [
        'types' => $types
    ]);
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

Route::get('/clear-cache', function () {
    Artisan::call('cache:clear');
    Artisan::call('config:clear');
    Artisan::call('route:clear');
    return "All cache cleared";
});
// Route::get('/config-clear', function () {
//     Artisan::call('config:clear');
//     return "All config cleared";
// });
// Route::get('/config-cache', function () {
//     Artisan::call('cache:clear');
//     return "All config cache";
// });

Route::get('/reverb-start', function () {
    Artisan::call('reverb:start --port=8080 host=0.0.0.0 hostname=merchants-admin.heroes.my');
    return "Reverb started";
});


Route::get('/list', function () {
    Artisan::call('list');
    return Artisan::output();
});


// Route::get('/events', function () {
//     return Inertia::render('Events/Events');
// })->middleware(['auth', 'verified'])->name('events');

// Route::get('/events/create', function () {
//     return Inertia::render('Events/CreateEvent');
// })->middleware(['auth', 'verified'])->name('events.create');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'dashboard'])->name('dashboard');

    Route::get('/chatrooms', [RoomController::class, 'rooms'])->name('chatrooms');

    Route::post('/chats', [ChatController::class, 'createMessage'])->name('create.message');
    Route::get('/chats/{id}', [ChatController::class, 'chats'])->name('chats');

    Route::get('/merchants', [MerchantController::class, 'merchants'])->name('merchants');
    Route::get('/merchants/{id}', [MerchantController::class, 'view'])->name('merchants.view');
    Route::put('/merchants/{merchant}', [MerchantController::class, 'update'])->name('merchants.update');
    Route::put('/merchants/approve/{id}', [MerchantController::class, 'approve'])->name('merchant.approve');
    Route::put('/merchants/reject/{id}', [MerchantController::class, 'reject'])->name('merchant.reject');
    Route::get('/merchantFileDownload/{id}', [MerchantController::class, 'fileDownload'])->name('fileDownload');


    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/products/create', [ProductController::class, 'createProduct'])->name('products.form');
    Route::post('/products/create', [ProductController::class, 'createProduct'])->name('products.create');
    Route::get('/products', [ProductController::class, 'products'])->name('products');
    Route::get('/products/{id}', [ProductController::class, 'view'])->name('product.view');
    Route::put('/products/approve/{id}', [ProductController::class, 'approve'])->name('product.approve');
    Route::put('/products/reject/{id}', [ProductController::class, 'reject'])->name('product.reject');

    Route::get('/categories', [CategoryController::class, 'categories']);
});

require __DIR__ . '/auth.php';
require __DIR__ . '/channels.php';
