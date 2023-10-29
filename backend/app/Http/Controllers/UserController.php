<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function createUser ($username, $email, $homepage_url) {
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

        $user->update(['username'=>$username]);
        return $user;
    }
}
