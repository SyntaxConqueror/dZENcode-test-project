<?php

use App\Http\Controllers\CommentsController;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function (){
   return view('index');
});
    /*
     *
     * Route group for creating Comments endpoints
     *
     * */
Route::group([
    'prefix' => 'api'
], function (){
    Route::post('/createComment', [CommentsController::class, 'createComment']);
    Route::post('/createPreviewComment', [CommentsController::class, 'createPreviewComment']);
});


    /*
     *
     * Route group for Comments and Users get endpoints
     *
     * */
Route::group([
    'prefix' => 'api'
], function () {
    Route::get('/getComments', [CommentsController::class, 'getComments']);
    Route::get('/test', [CommentsController::class, 'test']);
});


    /*
     *
     * Route group for Sort endpoints
     *
     * */
Route::group([
    'prefix' => 'api'
], function () {
    Route::get('/dateAscendingSort', [CommentsController::class, 'dateAscendingSort']);
    Route::get('/dateDescendingSort', [CommentsController::class, 'dateDescendingSort']);
    Route::get('/usernameSort', [CommentsController::class, 'usernameSort']);
    Route::get('/emailSort', [CommentsController::class, 'emailSort']);
});
