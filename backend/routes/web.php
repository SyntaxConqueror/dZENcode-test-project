<?php

use App\Http\Controllers\CommentsController;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Route;


    /*
     *
     * Route group for creating Comments endpoints
     *
     * */
Route::group([], function (){
    Route::post('/createComment', [CommentsController::class, 'createComment'])->middleware('comment.data');
    Route::post('/createPreviewComment', [CommentsController::class, 'createPreviewComment']);
});


    /*
     *
     * Route group for Comments and Users get endpoints
     *
     * */
Route::group([], function () {
    Route::get('/getComments', [CommentsController::class, 'getComments']);
});


    /*
     *
     * Route group for Sort endpoints
     *
     * */
Route::group([], function () {
    Route::get('/sort/{type}', [CommentsController::class, 'sort']);
});
