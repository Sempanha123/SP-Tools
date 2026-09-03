<?php

namespace App\Services\News;

use App\Models\Article;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

class PublicArticleQuery
{
    /**
     * Build a public article query.
     *
     * @param array<string, mixed> $filters
     */
    public function query(
        array $filters = [],
    ): Builder {
        $query = Article::query()
            ->published()
            ->with([
                'author:id,name',
                'category:id,name,slug',
                'tags:id,name,slug',
            ]);

        /*
        |--------------------------------------------------------------------------
        | Text search
        |--------------------------------------------------------------------------
        */

        $searchTerm = trim(
            (string) ($filters['q'] ?? ''),
        );

        if ($searchTerm !== '') {
            $like = "%{$searchTerm}%";

            $query->where(
                function (
                    Builder $searchQuery,
                ) use ($like): void {
                    $searchQuery
                        ->where(
                            'title',
                            'like',
                            $like,
                        )
                        ->orWhere(
                            'excerpt',
                            'like',
                            $like,
                        )
                        ->orWhere(
                            'lead',
                            'like',
                            $like,
                        )
                        ->orWhere(
                            'source',
                            'like',
                            $like,
                        )
                        ->orWhere(
                            'location',
                            'like',
                            $like,
                        )
                        ->orWhereHas(
                            'author',
                            fn (
                                Builder $authorQuery,
                            ) => $authorQuery->where(
                                'name',
                                'like',
                                $like,
                            ),
                        )
                        ->orWhereHas(
                            'category',
                            fn (
                                Builder $categoryQuery,
                            ) => $categoryQuery->where(
                                'name',
                                'like',
                                $like,
                            ),
                        )
                        ->orWhereHas(
                            'tags',
                            fn (
                                Builder $tagQuery,
                            ) => $tagQuery->where(
                                'name',
                                'like',
                                $like,
                            ),
                        );
                },
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Category, tag, and region filters
        |--------------------------------------------------------------------------
        */

        if (filled($filters['category'] ?? null)) {
            $categorySlug = $filters['category'];

            $query->whereHas(
                'category',
                fn (
                    Builder $categoryQuery,
                ) => $categoryQuery->where(
                    'slug',
                    $categorySlug,
                ),
            );
        }

        if (filled($filters['tag'] ?? null)) {
            $tagSlug = $filters['tag'];

            $query->whereHas(
                'tags',
                fn (
                    Builder $tagQuery,
                ) => $tagQuery->where(
                    'slug',
                    $tagSlug,
                ),
            );
        }

        if (filled($filters['region'] ?? null)) {
            $query->where(
                'region',
                $filters['region'],
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Article flags
        |--------------------------------------------------------------------------
        */

        if (
            array_key_exists(
                'featured',
                $filters,
            )
        ) {
            $query->where(
                'is_featured',
                $this->toBoolean(
                    $filters['featured'],
                ),
            );
        }

        if (
            array_key_exists(
                'breaking',
                $filters,
            )
        ) {
            $query->where(
                'is_breaking',
                $this->toBoolean(
                    $filters['breaking'],
                ),
            );
        }

        if (
            array_key_exists(
                'live',
                $filters,
            )
        ) {
            $query->where(
                'is_live',
                $this->toBoolean(
                    $filters['live'],
                ),
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Sorting
        |--------------------------------------------------------------------------
        */

        $sort = $filters['sort']
            ?? 'latest';

        switch ($sort) {
            case 'oldest':
                $query
                    ->orderBy(
                        'published_at',
                    )
                    ->orderBy('id');

                break;

            case 'popular':
                $query
                    ->orderByDesc('views')
                    ->orderByDesc(
                        'published_at',
                    );

                break;

            case 'latest':
            default:
                $query
                    ->orderByDesc(
                        'published_at',
                    )
                    ->orderByDesc('id');

                break;
        }

        return $query;
    }

    /**
     * @param array<string, mixed> $filters
     */
    public function paginate(
        array $filters = [],
    ): LengthAwarePaginator {
        $perPage = (int) (
            $filters['per_page']
            ?? 12
        );

        $perPage = max(
            1,
            min(50, $perPage),
        );

        return $this
            ->query($filters)
            ->paginate($perPage)
            ->withQueryString();
    }

    private function toBoolean(
        mixed $value,
    ): bool {
        return filter_var(
            $value,
            FILTER_VALIDATE_BOOLEAN,
        );
    }
}