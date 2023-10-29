<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class UsersCommentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $filesStorage = Storage::disk('s3')->allFiles("files/");
        $users = User::factory()->count(50)->create();

        foreach($users as $user) {
            $fileUrl = $filesStorage[array_rand($filesStorage)];
            Comment::factory()->count(5)->state([
                'user_id' => $user->id,
                'file_url' => Storage::disk('s3')->url(str_replace("files/", "", $fileUrl))
            ])->create();
        }
    }
}
