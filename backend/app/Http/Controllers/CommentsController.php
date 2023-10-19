<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\User;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CommentsController extends Controller
{

    /*
     *
     * Method to put file to Amazon AWS s3 Bucket
     *
     * */
    private function putFileToBucket ($file): string
    {
        try {
            if(!$file) return '';
            $fileName = uuid_create() . '.' . $file->getClientOriginalExtension();
            Storage::disk('s3')->put('files/'.$fileName, file_get_contents($file));
            return Storage::disk('s3')->url($fileName);
        }
        catch (Exception $error) {
            return Storage::disk('s3')->url('error__image__not__found.png');
        }

    }

    /*
     *
     * Methods to get or create Users
     *
     * */
    private function getOrCreateUser ($username, $email, $homepage_url) {

        try {
            $user = User::where('email', $email)->first();

            if(!$user) {

                $userData = [
                    'username' => $username,
                    'email' => $email,
                    'homepage_url' => $homepage_url,
                ];

                $user = User::create($userData);
                return $user;
            }

            return $user;
        }
        catch (Exception $error){
            return null;
        }

    }
    public function getUserByCommentId ($id): JsonResponse
    {
        try {
            return \response()->json(Comment::find($id)->user->username);
        }
        catch (Exception $error){
            return \response()->json([
               'statusCode' => $error->getCode(),
               'message' => $error->getMessage()
            ]);
        }

    }

    /*
     *
     * Method to create Comment from request data
     *
     * */
    private function createCommentFromRequest ($user_id, $text_content, $parentId, $file) {
        try {
            $commentData = [
                'user_id' => $user_id,
                'text_content' => $text_content,
                'parent_id' => $parentId != "null" ? intval($parentId) : null,
                'file_url' => $this->putFileToBucket($file),
            ];

            return Comment::create($commentData);
        }
        catch (Exception $error){
            return null;
        }

    }

    /*
     *
     * Method to build an array with nested structure
     *
     * */
    private function buildNestedStructure($comments, $parentId = null): ?array
    {
        try {
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
        catch (Exception $error) {
            return null;
        }

    }

    /*
     *
     * Sorting comments by:
     * Date - Ascending
     * Date - Descending
     * Username
     * Email
     *
     * */
    public function dateAscendingSort (): ?JsonResponse
    {
        try {
            $comments = Comment::orderBy('created_at', 'asc')->get();
            $nestedObjects = $this->buildNestedStructure($comments);
            return response()->json($nestedObjects);
        }
        catch (Exception $error) { return null; }

    }
    public function dateDescendingSort (): ?JsonResponse
    {
        try {
            $comments = Comment::orderBy('created_at', 'desc')->get();
            $nestedObjects = $this->buildNestedStructure($comments);
            return response()->json($nestedObjects);
        }
        catch (Exception $error) { return null; }

    }
    public function usernameSort (): ?JsonResponse
    {
        try {
            $comments = Comment::select('comments.*')
                ->join('users', 'comments.user_id', '=', 'users.id')
                ->orderBy('users.username', 'asc')
                ->get();

            $nestedObjects = $this->buildNestedStructure($comments);
            return response()->json($nestedObjects);
        }
        catch (Exception $error) { return null; }

    }
    public function emailSort (): ?JsonResponse
    {
        try {
            $comments = Comment::select('comments.*')
                ->join('users', 'comments.user_id', '=', 'users.id')
                ->orderBy('users.email', 'asc')
                ->get();
            $nestedObjects = $this->buildNestedStructure($comments);
            return response()->json($nestedObjects);
        }
        catch (Exception $error) {
            return null;
        }

    }

    /*
     *
     * Method to get all comments and return them
     *
     * */
    public function getComments(): ?JsonResponse
    {
        try {
            $comments = Comment::all()->reverse();
            $nestedObjects = $this->buildNestedStructure($comments);
            return response()->json($nestedObjects);
        }
        catch (Exception $error){
            return null;
        }

    }


    /*
     *
     * Method to create and return all comments
     *
     * */
    public function createComment(Request $request): JsonResponse
    {

        try{
            // Request validation
            $request -> validate([
                'username' => 'required|string|min:3|max:25',
                'email'=>'required|email',
                'homepageURL'=> 'nullable|url',
                'text_content' => 'required|string|max:2000',
                'parentId' => 'nullable',
                'file' => 'nullable'
            ]);

            // Getting or creating user
            $user = $this->getOrCreateUser(
                $request->username,
                $request->email,
                $request->homepageURL);
            if(!$user) throw new Exception("There is some problem with user!");

            // Creating comment
            $comment = $this->createCommentFromRequest(
                $user->id,
                $request->text_content,
                $request->parentId,
                $request->file('file'));
            if(!$comment) throw new Exception("There is some problem with pushing a comment!");

            // Attaching comment to user
            $user->comments()->attach($comment);

            // Build a nested structure array
            $comments = $this->getComments();
            if(!$comments) throw new Exception('No ability to get comments pull!');

            // Returning it in response
            return response()->json($comments);
        }
        catch (Exception $err) {
            $response = [
                'statusCode' => $err->getCode(),
                'message' => $err->getMessage(),
                'messages' => $err->getTraceAsString()
            ];
            return response()->json($response);
        }
    }
    public function createPreviewComment(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'username' => 'required|string|min:3|max:25',
                'email' => 'required|email',
                'text_content' => 'required|string|max:2000',
                'file' => 'nullable'
            ]);

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
        catch (Exception $error){
            return response()->json([
                'statusCode' => $error->getCode(),
                'message' => $error->getMessage(),
            ]);
        }

    }
}
