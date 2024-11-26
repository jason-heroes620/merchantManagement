<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

use App\Http\Controllers\API\ChatController;
use App\Http\Controllers\API\RoomController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\ProductController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('csrf');

// Route::post('/sanctum/token', function (Request $request) {
//     $request->validate([
//         'email' => 'required|email',
//         'password' => 'required',
//         // 'device_name' => 'required',
//     ]);

//     $user = User::where('email', $request->email)->first();

//     if (!$user || !Hash::check($request->password, $user->password)) {
//         throw ValidationException::withMessages([
//             'email' => ['The provided credentials are incorrect.'],
//         ]);
//     }

//     return $user->createToken($request->email)->plainTextToken;
// });

Route::post('/login', [UserController::class, 'login']);


Route::middleware('auth:sanctum')->group(function () {

    Route::get('/chatrooms', [RoomController::class, 'rooms']);
    Route::patch('/updatechatroom/{id}', [RoomController::class, 'roomsChatUpdate']);

    Route::get('/chats/{id}', [ChatController::class, 'chats']);
    Route::post('/createMessage', [ChatController::class, 'createMessage']);

    Route::get('/unreadChats/', [ChatController::class, 'unreadChats']);

    Route::post('/logout', [UserController::class, 'logout']);

    Route::get('/products/current/{page}', [ProductController::class, 'current']);
    Route::get('/products/history/{page}', [ProductController::class, 'history']);
    Route::get('/products/comingup/{page}', [ProductController::class, 'comingup']);
});
