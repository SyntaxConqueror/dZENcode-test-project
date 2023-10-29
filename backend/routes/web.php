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
    Route::post('/createComment', [CommentsController::class, 'createComment']);
    Route::post('/createPreviewComment', [CommentsController::class, 'createPreviewComment']);
});


    /*
     *
     * Route group for sort and get Comments endpoints
     *
     * */
Route::group([], function () {
    Route::get('/getComments/{sortType?}', [CommentsController::class, 'getComments']);
});

