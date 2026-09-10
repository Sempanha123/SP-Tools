<?php

return [
    /*
    |--------------------------------------------------------------------------
    | News frontend
    |--------------------------------------------------------------------------
    */

    'frontend_url' => env(
        'NEWS_FRONTEND_URL',
        'http://localhost:3000',
    ),

    /*
    |--------------------------------------------------------------------------
    | Initial administrator
    |--------------------------------------------------------------------------
    */

    'admin' => [
        'name' => env(
            'NEWS_ADMIN_NAME',
            'SP-Tools Administrator',
        ),

        'email' => env(
            'NEWS_ADMIN_EMAIL',
            'admin@sptools.local',
        ),

        'password' => env(
            'NEWS_ADMIN_PASSWORD',
            'ChangeThisPassword123!',
        ),
    ],
];