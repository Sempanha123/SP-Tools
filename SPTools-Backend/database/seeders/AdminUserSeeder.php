<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $adminConfig =
            config('news.admin');

        User::updateOrCreate(
            [
                'email' =>
                    $adminConfig['email'],
            ],
            [
                'name' =>
                    $adminConfig['name'],

                'password' =>
                    $adminConfig['password'],

                'role' =>
                    UserRole::Admin,

                'bio' =>
                    'Administrator for the SP-Tools News publishing system.',

                'location' =>
                    'Cambodia',

                'is_active' =>
                    true,

                'email_verified_at' =>
                    now(),
            ],
        );
    }
}