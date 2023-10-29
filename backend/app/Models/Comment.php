<?php

namespace App\Models;

use App\Http\Controllers\CommentsController;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Comment extends Model
{
    use HasFactory;
    protected $guarded = false;

    public function user(){
        return $this->belongsTo(User::class, 'user_id');
    }
}
