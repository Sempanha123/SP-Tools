<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\NewsIndexRequest;
use App\Http\Resources\Api\V1\ArticleResource;
use App\Models\Article;
use App\Models\Tag;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TagController extends Controller
{
    public function index(): JsonResponse
    {
        $tags = Tag::query()
            ->withCount([
                'articles as articles_count' =>
                    fn (Builder $query) => $query->published(),
            ])
            ->orderByDesc('articles_count')
            ->orderBy('name')
            ->get()
            ->map(
                fn (Tag $tag): array => [
                    'id' => (int) $tag->id,
                    'name' => (string) $tag->name,
                    'slug' => (string) $tag->slug,
                    'description' => $tag->description,
                    'articlesCount' =>
                        (int) $tag->articles_count,
                ],
            )
            ->values();

        return response()->json([
            'data' => $tags,
        ]);
    }

    public function news(
        NewsIndexRequest $request,
        Tag $tag,
    ): AnonymousResourceCollection {
        $validated = $request->validated();

        $query = Article::query()
            ->with([
                'author',
                'category',
                'tags',
            ])
            ->published()
            ->whereHas(
                'tags',
                fn (Builder $tagQuery) =>
                    $tagQuery->whereKey($tag->getKey()),
            );

        $this->applyFilters($query, $validated);
        $this->applySorting($query, $validated);

        $perPage = min(
            max((int) ($validated['per_page'] ?? 12), 1),
            50,
        );

        $articles = $query
            ->paginate($perPage)
            ->withQueryString();

        return ArticleResource::collection($articles)
            ->additional([
                'context' => [
                    'type' => 'tag',
                    'slug' => $tag->slug,
                    'name' => $tag->name,
                    'description' => $tag->description,
                ],
            ]);
    }

    /**
     * @param Builder<Article> $query
     * @param array<string, mixed> $filters
     */
    private function applyFilters(
        Builder $query,
        array $filters,
    ): void {
        $search = trim((string) ($filters['q'] ?? ''));

        if ($search !== '') {
            $query->where(
                function (Builder $searchQuery) use ($search): void {
                    $searchQuery
                        ->where('title', 'like', "%{$search}%")
                        ->orWhere('excerpt', 'like', "%{$search}%")
                        ->orWhere('lead', 'like', "%{$search}%");
                },
            );
        }

        $category = trim((string) ($filters['category'] ?? ''));

        if ($category !== '') {
            $query->whereHas(
                'category',
                fn (Builder $categoryQuery) =>
                    $categoryQuery->where('slug', $category),
            );
        }

        $region = trim((string) ($filters['region'] ?? ''));

        if ($region !== '') {
            $query->where('region', $region);
        }

        $displayFields = [
            'featured' => 'is_featured',
            'breaking' => 'is_breaking',
            'live' => 'is_live',
        ];

        foreach ($displayFields as $filter => $column) {
            if (! array_key_exists($filter, $filters)) {
                continue;
            }

            $query->where(
                $column,
                filter_var(
                    $filters[$filter],
                    FILTER_VALIDATE_BOOLEAN,
                ),
            );
        }

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
}
