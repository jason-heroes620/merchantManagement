<?php

use App\Events\MerchantApplicationApprove;
use App\Models\MerchantType;

use App\Http\Controllers\RoomController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DiscountController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\MerchantController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductProfitController;
use App\Http\Controllers\ProductImageController;
use App\Http\Controllers\QuotationController;
use App\Http\Controllers\QuotationItemController;
use App\Http\Controllers\SchoolController;
use App\Models\Merchant;
use Illuminate\Foundation\Application;
use Illuminate\Notifications\Messages\MailMessage;
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


// to be removed after test
Route::get('/test-new-merchant-email', function () {
    $merchant = Merchant::where('id', 27)->first();
    // event(new NewMerchantApplication($merchant));
    // return (new MailMessage)->markdown('emails.newmerchantresponse', compact('merchant'));

    // $password = Str::random(10);
    // $user = App\Models\User::create([
    //     'name' => $merchant->person_in_charge,
    //     'email' => $merchant->merchant_email,
    //     'password' => $password
    // ]);
    // Password::sendResetLink(
    //     $user->only('email')
    // );

    // $user->assignRole('Merchant');
    event(new MerchantApplicationApprove($merchant));
    return (new MailMessage)->markdown('emails.merchantapproved', compact('merchant'));
});

// Route::get('/test-new-merchant-email', [MerchantController::class, 'testMerchantEmail']);

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
Route::get('/storage-link', function () {
    Artisan::call('storage:link');
    return "All config cleared";
});
// Route::get('/config-cache', function () {
//     Artisan::call('cache:clear');
//     return "All config cache";
// });

// Route::get('/reverb-start', function () {
//     Artisan::call('reverb:start --port=8080 host=0.0.0.0 hostname=merchants-admin.heroes.my');
//     return "Reverb started";
// });


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

    Route::get('/merchants/{type?}', [MerchantController::class, 'merchants'])->name('merchants');
    Route::get('/merchant/{id}', [MerchantController::class, 'view'])->name('merchant.view');
    Route::put('/merchant/{id?}', [MerchantController::class, 'update'])->name('merchant.update');
    Route::put('/merchant/approve/{id}', [MerchantController::class, 'approve'])->name('merchant.approve');
    Route::put('/merchant/reject/{id}', [MerchantController::class, 'reject'])->name('merchant.reject');
    Route::get('/merchantFileDownload/{id}', [MerchantController::class, 'fileDownload'])->name('file.download');
    Route::post('/merchantFileUpload/{id}', [MerchantController::class, 'fileUpload'])->name('file.upload');
    Route::get('/merchantFileView/{id}', [MerchantController::class, 'fileView'])->name('file.view');


    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/products/create', [ProductController::class, 'createProduct'])->name('product.form');
    Route::post('/products/create', [ProductController::class, 'createProduct'])->name('product.create');
    Route::get('/products/{type?}', [ProductController::class, 'products'])->name('products');
    Route::get('/product/{id}', [ProductController::class, 'view'])->name('product.view');
    Route::post('/product/{id}', [ProductController::class, 'update'])->name('product.update');
    Route::put('/product/approve/{id}', [ProductController::class, 'approve'])->name('product.approve');
    Route::put('/product/reject/{id}', [ProductController::class, 'reject'])->name('product.reject');

    Route::post('/productprofit/add_profit/{id}', [ProductProfitController::class, 'add_profit'])->name('product.addprofit');
    Route::put('/productprofit/edit_profit/{id}', [ProductProfitController::class, 'edit_profit'])->name('product.editprofit');

    Route::delete('product-image/delete/{id}', [ProductImageController::class, 'delete'])->name('product_image.delete');
    Route::get('/categories', [CategoryController::class, 'categories']);


    // Schools
    Route::get('/schools/{type?}', [SchoolController::class, 'index'])->name('schools');
    Route::get('/school/{id?}', [SchoolController::class, 'view'])->name('school.view');

    // Quotations
    Route::get('/quotations', [QuotationController::class, 'index'])->name('quotations');
    Route::get('/quotation/{id}', [QuotationController::class, 'view'])->name('quotation.view');
    Route::put('/quotation/{id}', [QuotationController::class, 'update'])->name('quotation.update');

    Route::put('/quotationItem/{id}', [QuotationItemController::class, 'transportation_update'])->name('quotation.transportation.update');

    // Invoices
    Route::get('/invoices', [InvoiceController::class, 'index'])->name('invoices');

    // Discount
    Route::post('/discount', [DiscountController::class, 'create'])->name('discount.create');
});

require __DIR__ . '/auth.php';
require __DIR__ . '/channels.php';
