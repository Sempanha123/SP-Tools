<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing
    |--------------------------------------------------------------------------
    */

    'paths' => [
        'api/*',
    ],

    'allowed_methods' => [
        '*',
    ],

    'allowed_origins' => [
        env(
            'NEWS_FRONTEND_URL',
            'http://localhost:3000',
        ),

        'http://127.0.0.1:3000',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => [
        '*',
    ],

    'exposed_headers' => [],

    'max_age' => 0,

    /*
     * The public news API does not currently use
     * cookie authentication.
     */
    'supports_credentials' => false,
];