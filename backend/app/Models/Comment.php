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

    /*
     *
     * Method to create Comment from request data
     *
     * */
    public function pushComment ($user_id, $text_content, $parentId, $file) {
        $commentData = [
            'user_id' => $user_id,
            'text_content' => $text_content,
            'parent_id' => $parentId != "null" ? intval($parentId) : null,
            'file_url' => (new CommentsController)->putFileToBucket($file),
        ];

        Cache::flush();
        return Comment::create($commentData);
    }
}
