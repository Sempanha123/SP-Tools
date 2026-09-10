<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\NewsIndexRequest;
use App\Http\Resources\Api\V1\ArticleResource;
use App\Models\Article;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ArticleController extends Controller
{
    public function index(
        NewsIndexRequest $request,
    ): AnonymousResourceCollection {
        return $this->paginatedArticles($request);
    }

    public function search(
        NewsIndexRequest $request,
    ): AnonymousResourceCollection {
        return $this->paginatedArticles($request);
    }

    public function featured(
        Request $request,
    ): AnonymousResourceCollection {
        $limit = $this->resolveLimit($request, 6);

        $articles = $this->publishedArticleQuery()
            ->where('is_featured', true)
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->limit($limit)
            ->get();

        return ArticleResource::collection($articles)
            ->additional([
                'meta' => [
                    'limit' => $limit,
                ],
            ]);
    }

    public function breaking(
        Request $request,
    ): AnonymousResourceCollection {
        $limit = $this->resolveLimit($request, 10);

        $articles = $this->publishedArticleQuery()
            ->where('is_breaking', true)
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->limit($limit)
            ->get();

        return ArticleResource::collection($articles)
            ->additional([
                'meta' => [
                    'limit' => $limit,
                ],
            ]);
    }

    public function mostRead(
        Request $request,
    ): AnonymousResourceCollection {
        $limit = $this->resolveLimit($request, 10);

        $articles = $this->publishedArticleQuery()
            ->orderByDesc('views')
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->limit($limit)
            ->get();

        return ArticleResource::collection($articles)
            ->additional([
                'meta' => [
                    'limit' => $limit,
                ],
            ]);
    }

    public function show(
        string $slug,
    ): ArticleResource {
        $article = $this->publishedArticleQuery()
            ->where('slug', $slug)
            ->firstOrFail();

        $article->increment('views');

        $article->refresh();
        $article->load([
            'author',
            'category',
            'tags',
        ]);

        return new ArticleResource($article);
    }

    private function paginatedArticles(
        NewsIndexRequest $request,
    ): AnonymousResourceCollection {
        $validated = $request->validated();

        $query = $this->publishedArticleQuery();

        $this->applySearch($query, $validated);
        $this->applyCategoryFilter($query, $validated);
        $this->applyTagFilter($query, $validated);
        $this->applyRegionFilter($query, $validated);
        $this->applyDisplayFilters($query, $validated);
        $this->applyDateFilter($query, $validated);
        $this->applySorting($query, $validated);

        $perPage = min(
            max(
                (int) ($validated['per_page'] ?? 12),
                1,
            ),
            50,
        );

        $articles = $query
            ->paginate($perPage)
            ->withQueryString();

        return ArticleResource::collection($articles);
    }

    /**
     * @return Builder<Article>
     */
    private function publishedArticleQuery(): Builder
    {
        return Article::query()
            ->with([
                'author',
                'category',
                'tags',
            ])
            ->published();
    }

    /**
     * @param Builder<Article> $query
     * @param array<string, mixed> $filters
     */
    private function applySearch(
        Builder $query,
        array $filters,
    ): void {
        $search = trim((string) ($filters['q'] ?? ''));

        if ($search === '') {
            return;
        }

        $query->where(
            function (Builder $searchQuery) use ($search): void {
                $searchQuery
                    ->where('title', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%")
                    ->orWhere('lead', 'like', "%{$search}%")
                    ->orWhere('source', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%")
                    ->orWhereHas(
                        'author',
                        fn (Builder $authorQuery) =>
                            $authorQuery->where(
                                'name',
                                'like',
                                "%{$search}%",
                            ),
                    )
                    ->orWhereHas(
                        'category',
                        function (Builder $categoryQuery) use ($search): void {
                            $categoryQuery
                                ->where('name', 'like', "%{$search}%")
                                ->orWhere('slug', 'like', "%{$search}%");
                        },
                    )
                    ->orWhereHas(
                        'tags',
                        function (Builder $tagQuery) use ($search): void {
                            $tagQuery
                                ->where('name', 'like', "%{$search}%")
                                ->orWhere('slug', 'like', "%{$search}%");
                        },
                    );
            },
        );
    }

    /**
     * @param Builder<Article> $query
     * @param array<string, mixed> $filters
     */
    private function applyCategoryFilter(
        Builder $query,
        array $filters,
    ): void {
        $category = trim((string) ($filters['category'] ?? ''));

        if ($category === '') {
            return;
        }

        $query->whereHas(
            'category',
            fn (Builder $categoryQuery) =>
                $categoryQuery->where('slug', $category),
        );
    }

    /**
     * @param Builder<Article> $query
     * @param array<string, mixed> $filters
     */
    private function applyTagFilter(
        Builder $query,
        array $filters,
    ): void {
        $tag = trim((string) ($filters['tag'] ?? ''));

        if ($tag === '') {
            return;
        }

        $query->whereHas(
            'tags',
            fn (Builder $tagQuery) =>
                $tagQuery->where('slug', $tag),
        );
    }

    /**
     * @param Builder<Article> $query
     * @param array<string, mixed> $filters
     */
    private function applyRegionFilter(
        Builder $query,
        array $filters,
    ): void {
        $region = trim((string) ($filters['region'] ?? ''));

        if ($region !== '') {
            $query->where('region', $region);
        }
    }

    /**
     * @param Builder<Article> $query
     * @param array<string, mixed> $filters
     */
    private function applyDisplayFilters(
        Builder $query,
        array $filters,
    ): void {
        $fields = [
            'featured' => 'is_featured',
            'breaking' => 'is_breaking',
            'live' => 'is_live',
        ];

        foreach ($fields as $filter => $column) {
            if (! array_key_exists($filter, $filters)) {
                continue;
            }

            $value = filter_var(
                $filters[$filter],
                FILTER_VALIDATE_BOOLEAN,
            );

            $query->where($column, $value);
        }
    }

    /**
     * @param Builder<Article> $query
     * @param array<string, mixed> $filters
     */
    private function applyDateFilter(
        Builder $query,
        array $filters,
    ): void {
        $fromDate = match ($filters['date'] ?? null) {
            '24h' => now()->subDay(),
            '7d' => now()->subDays(7),
            '30d' => now()->subDays(30),
            default => null,
        };

        if ($fromDate !== null) {
            $query->where('published_at', '>=', $fromDate);
        }
    }

    /**
     * @param Builder<Article> $query
     * @param array<string, mixed> $filters
     */
    private function applySorting(
        Builder $query,
        array $filters,
    ): void {
        match ($filters['sort'] ?? 'latest') {
            'oldest' => $query
                ->orderBy('published_at', 'asc')
                ->orderBy('id', 'asc'),

            'popular' => $query
                ->orderByDesc('views')
                ->orderByDesc('published_at')
                ->orderByDesc('id'),

            default => $query
                ->orderByDesc('published_at')
                ->orderByDesc('id'),
        };
    }

    private function resolveLimit(
        Request $request,
        int $default,
    ): int {
        $validated = $request->validate([
            'limit' => [
                'sometimes',
                'integer',
                'between:1,50',
            ],
        ]);

        return min(
            max((int) ($validated['limit'] ?? $default), 1),
            50,
        );
    }
}
