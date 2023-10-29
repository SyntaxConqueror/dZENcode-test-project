<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class CommentsController extends Controller
{
    private int $cacheMinutes = 120;

    /*
     *
     * Method to put file to Amazon AWS s3 Bucket
     *
     * */
    public function putFileToBucket ($file): string
    {
        if(!$file) return '';

        $fileName = uuid_create() . '.' . $file->getClientOriginalExtension();
        Storage::disk('s3')->put('files/'.$fileName, file_get_contents($file));

        return Storage::disk('s3')->url($fileName);
    }


    /*
     *
     * Method to build an array with nested structure
     *
     * */
    private function buildNestedStructure($comments, $parentId = null): ?array
    {
        $result = [];

        foreach ($comments as $comment) {
            $comment['username'] = $comment->user->username;

            if ($comment['parent_id'] == $parentId) {
                $comment['replies'] = $this->buildNestedStructure($comments, $comment['id']);
                $result[] = $comment;
            }
        }

        return $result;
    }


    /*
     *
     * Cache provided
     * Sorting comments by: date, username, email
     *
     * */
    public function sort ($type): ?JsonResponse
    {
        $cacheKey = $type;

        $nestedObjects = Cache::remember($cacheKey, $this->cacheMinutes, function () use ($type) {
            $comments = match ($type) {
                'dateAscendingSort' => Comment::orderBy('created_at', 'asc')->get(),
                'dateDescendingSort' => Comment::orderBy('created_at', 'desc')->get(),
                'usernameSort' => Comment::select('comments.*')
                    ->join('users', 'comments.user_id', '=', 'users.id')
                    ->orderBy('users.username', 'asc')
                    ->get(),
                'emailSort' => Comment::select('comments.*')
                    ->join('users', 'comments.user_id', '=', 'users.id')
                    ->orderBy('users.email', 'asc')
                    ->get(),
                default => Comment::orderBy('created_at', 'asc')->get(),
            };

            return $this->buildNestedStructure($comments);
        });

        return response()->json($nestedObjects);
    }


    /*
     *
     * Cache provided
     * Method to get all comments and return them
     *
     * */
    public function getComments(): ?JsonResponse
    {
        $cacheKey = 'comments';

        $nestedObjects = Cache::remember($cacheKey, $this->cacheMinutes, function () {
            $comments = Comment::all()->reverse();
            return $this->buildNestedStructure($comments);
        });

        return response()->json($nestedObjects);
    }


    /*
     *
     * Method to create and return all comments
     *
     * */
    public function createComment(Request $request): JsonResponse
    {
        // Getting or creating user
        $user = (new UserController)->createUser(
            $request->username,
            $request->email,
            $request->homepageURL);

        // Creating comment
        (new Comment)->pushComment(
            $user->id,
            $request->text_content,
            $request->parentId,
            $request->file('file'));

        // Build a nested structure array
        $comments = $this->getComments();

        // Returning it in response
        return response()->json($comments);
    }


    /*
     *
     * Method to create and return preview comment data
     *
     * */
    public function createPreviewComment(Request $request): JsonResponse
    {
        $previewData = [
            'id' => intval($request->id),
            'username' => $request->username,
            'text_content' => $request->text_content,
            'file' => $request->file !== "null" ? $request->file : null,
            'file_type' => $request->file_type,
            'created_at' => $request->created_at
        ];

        return response()->json($previewData);
    }

}
