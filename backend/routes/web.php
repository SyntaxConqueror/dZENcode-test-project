<?php

use App\Http\Controllers\CommentsController;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Route;


Route::group([
    'prefix' => 'api'
], function (){
    Route::post('/createComment', [CommentsController::class, 'createComment']);
});
