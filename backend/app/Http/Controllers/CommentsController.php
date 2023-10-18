<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Exception;
use GuzzleHttp\Psr7\UploadedFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CommentsController extends Controller
{

    private function putFileToBucket ($file) {
        try{
            $f = $file->fds();
            $fileName = uuid_create() . '.' . $file->getClientOriginalExtension();
            Storage::disk('s3')->put('files/'.$fileName, file_get_contents($file));
            return Storage::disk('s3')->url($fileName);
        }   catch (Exception $error) {
            return Storage::disk('s3')->url('error__image__not__found.png');
        }

    }

    public function createComment(Request $request){

        try{
            $request -> validate([
                'username' => 'required|string|min:3',
                'email'=>'required|email',
                'homepageURL'=> 'nullable|url',
                'text_content' => 'required|string',
                'parentId' => 'nullable',
                'file' => 'nullable'
            ]);



            $commentData = [
                'username' => $request->username,
                'email' => $request->email,
                'homepage_url' => $request->homepageURL,
                'content' => $request->text_content,
                'parent_id' => $request->parentId != "null" ? intval($request->parentId) : null,
                'file_url' => $this->putFileToBucket($request->file('file')),
            ];

            //Comment::create($commentData);
            return response()->json($commentData);
        } catch (Exception $err) {
            $response = [
                'statusCode' => $err->getCode(),
                'message' => $err->getMessage(),
                'messages' => $err->getTraceAsString()
            ];
            return response()->json($response);
        }
    }
}
