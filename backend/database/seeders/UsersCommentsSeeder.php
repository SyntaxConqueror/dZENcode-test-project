<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class UsersCommentsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $filesStorage = Storage::disk('s3')->allFiles("/files");

        for ($i = 0; $i < 50; $i++ ) {
            $user = User::create([
                'username' => fake()->firstName(),
                'email' => fake()->unique()->safeEmail(),
                'homepage_url' => fake()->optional(0.7)->url(),
            ]);

            for($g = 0; $g < 5; $g++) {
                $fileUrl = $filesStorage[array_rand($filesStorage)];
                $comment = Comment::create([
                    'user_id' => $user->id,
                    'text_content' => fake()->text(350),
                    'parent_id' => fake()->optional(0.5)->randomNumber(2),
                    'file_url' => Storage::disk('s3')->url(str_replace("files/", "", $fileUrl)),
                ]);

                $user->comments()->attach($comment);
            }
        }


    }
}
