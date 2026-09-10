<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\NewsIndexRequest;
use App\Http\Resources\Api\V1\ArticleResource;
use App\Models\Article;
use App\Models\Category;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::query()
            ->where('is_active', true)
            ->withCount([
                'articles as articles_count' =>
                    fn (Builder $query) => $query->published(),
            ])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->map(
                fn (Category $category): array => [
                    'id' => (int) $category->id,
                    'name' => (string) $category->name,
                    'slug' => (string) $category->slug,
                    'description' => $category->description,
                    'icon' => $category->icon,
                    'color' => $category->color,
                    'isActive' => (bool) $category->is_active,
                    'sortOrder' => (int) $category->sort_order,
                    'articlesCount' =>
                        (int) $category->articles_count,
                ],
            )
            ->values();

        return response()->json([
            'data' => $categories,
        ]);
    }

    public function news(
        NewsIndexRequest $request,
        Category $category,
    ): AnonymousResourceCollection {
        abort_unless(
            (bool) $category->is_active,
            404,
        );

        $validated = $request->validated();

        $query = Article::query()
            ->with([
                'author',
                'category',
                'tags',
            ])
            ->published()
            ->where('category_id', $category->id);

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
                    'type' => 'category',
                    'slug' => $category->slug,
                    'name' => $category->name,
                    'description' => $category->description,
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

        $tag = trim((string) ($filters['tag'] ?? ''));

        if ($tag !== '') {
            $query->whereHas(
                'tags',
                fn (Builder $tagQuery) =>
                    $tagQuery->where('slug', $tag),
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
