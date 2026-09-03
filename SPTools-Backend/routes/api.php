<?php

use App\Http\Controllers\Api\V1\ArticleController;
use App\Http\Controllers\Api\V1\AuthorController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\TagController;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')
    ->name('api.v1.')
    ->group(function (): void {
        /*
        |--------------------------------------------------------------------------
        | Health
        |--------------------------------------------------------------------------
        */

        Route::get(
            '/health',
            function (): JsonResponse {
                return response()->json([
                    'status' => 'ok',
                    'service' => 'SP-Tools News API',
                    'time' => now()->toISOString(),
                ]);
            },
        )->name('health');

        /*
        |--------------------------------------------------------------------------
        | News
        |--------------------------------------------------------------------------
        |
        | Static routes must remain before /{slug}.
        |
        */

        Route::prefix('news')
            ->name('news.')
            ->controller(ArticleController::class)
            ->group(function (): void {
                Route::get(
                    '/',
                    'index',
                )->name('index');

                Route::get(
                    '/search',
                    'search',
                )->name('search');

                Route::get(
                    '/featured',
                    'featured',
                )->name('featured');

                Route::get(
                    '/breaking',
                    'breaking',
                )->name('breaking');

                Route::get(
                    '/most-read',
                    'mostRead',
                )->name('most-read');

                Route::get(
                    '/{slug}',
                    'show',
                )
                    ->where(
                        'slug',
                        '[A-Za-z0-9-]+',
                    )
                    ->name('show');
            });

        /*
        |--------------------------------------------------------------------------
        | Categories
        |--------------------------------------------------------------------------
        */

        Route::get(
            '/categories',
            [
                CategoryController::class,
                'index',
            ],
        )->name('categories.index');

        Route::get(
            '/categories/{category:slug}/news',
            [
                CategoryController::class,
                'news',
            ],
        )
            ->where(
                'category',
                '[A-Za-z0-9-]+',
            )
            ->name('categories.news');

        /*
        |--------------------------------------------------------------------------
        | Tags
        |--------------------------------------------------------------------------
        */

        Route::get(
            '/tags',
            [
                TagController::class,
                'index',
            ],
        )->name('tags.index');

        Route::get(
            '/tags/{tag:slug}/news',
            [
                TagController::class,
                'news',
            ],
        )
            ->where(
                'tag',
                '[A-Za-z0-9-]+',
            )
            ->name('tags.news');

        /*
        |--------------------------------------------------------------------------
        | Authors
        |--------------------------------------------------------------------------
        */

        Route::get(
            '/authors/{slug}/news',
            [
                AuthorController::class,
                'news',
            ],
        )
            ->where(
                'slug',
                '[A-Za-z0-9-]+',
            )
            ->name('authors.news');
    });
