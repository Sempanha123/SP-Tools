<?php

return [
    'paths' => ['api/*'],

    'allowed_methods' => ['*'],

    // Production should set NEWS_FRONTEND_URL to the real Nuxt origin.
    // The explicit loopback origins keep local development working on either
    // the default port or the SP-Tools 3001 development port.
    'allowed_origins' => array_values(array_unique(array_filter([
        env('NEWS_FRONTEND_URL'),
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3001',
    ]))),

    // Also permit loopback dev servers on a different local port without
    // weakening production cross-origin policy for arbitrary remote hosts.
    'allowed_origins_patterns' => [
        '#^https?://localhost(?::\d+)?$#',
        '#^https?://127\.0\.0\.1(?::\d+)?$#',
    ],

    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 600,
    'supports_credentials' => false,
];
