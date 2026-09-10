<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\NewsIndexRequest;
use App\Http\Resources\Api\V1\ArticleResource;
use App\Models\Article;
use App\Models\User;
use BackedEnum;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AuthorController extends Controller
{
    public function news(
        NewsIndexRequest $request,
        string $slug,
    ): AnonymousResourceCollection {
        $author = User::query()
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        $validated = $request->validated();

        $query = Article::query()
            ->with([
                'author',
                'category',
                'tags',
            ])
            ->published()
            ->where('author_id', $author->id);

        $this->applyFilters($query, $validated);
        $this->applySorting($query, $validated);

        $perPage = min(
            max((int) ($validated['per_page'] ?? 9), 1),
            50,
        );

        $articles = $query
            ->paginate($perPage)
            ->withQueryString();

        $publishedArticlesQuery = Article::query()
            ->published()
            ->where('author_id', $author->id);

        $articlesCount = (
            clone $publishedArticlesQuery
        )->count();

        $totalViews = (int) (
            clone $publishedArticlesQuery
        )->sum('views');

        $latestPublishedAt = (
            clone $publishedArticlesQuery
        )->max('published_at');

        $categories = Article::query()
            ->published()
            ->where('articles.author_id', $author->id)
            ->join(
                'categories',
                'categories.id',
                '=',
                'articles.category_id',
            )
            ->select([
                'categories.id',
                'categories.name',
                'categories.slug',
            ])
            ->distinct()
            ->orderBy('categories.name')
            ->get()
            ->map(
                fn ($category): array => [
                    'id' => (int) $category->id,
                    'name' => (string) $category->name,
                    'slug' => (string) $category->slug,
                ],
            )
            ->values();

        $regions = Article::query()
            ->published()
            ->where('author_id', $author->id)
            ->whereNotNull('region')
            ->where('region', '!=', '')
            ->distinct()
            ->orderBy('region')
            ->pluck('region')
            ->map(
                fn ($region): string => (string) $region,
            )
            ->values();

        $roleValue = $author->role instanceof BackedEnum
            ? $author->role->value
            : $author->role;

        return ArticleResource::collection($articles)
            ->additional([
                'context' => [
                    'type' => 'author',
                    'id' => (int) $author->id,
                    'slug' => (string) $author->slug,
                    'name' => (string) $author->name,
                    'bio' => $author->bio,
                    'avatar' => $this->resolveAvatarUrl(
                        $author->avatar,
                    ),
                    'location' => $author->location,
                    'role' => filled($roleValue)
                        ? Str::headline((string) $roleValue)
                        : null,
                    'verified' =>
                        (bool) $author->is_verified,
                    'joinedAt' => $author->created_at
                        ?->toIso8601String(),
                    'latestPublishedAt' =>
                        $latestPublishedAt
                            ? Carbon::parse(
                                $latestPublishedAt,
                            )->toIso8601String()
                            : null,
                    'articlesCount' => $articlesCount,
                    'totalViews' => $totalViews,
                    'categories' => $categories,
                    'regions' => $regions,
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

    private function resolveAvatarUrl(
        ?string $avatar,
    ): ?string {
        if (blank($avatar)) {
            return null;
        }

        if (
            Str::startsWith(
                $avatar,
                [
                    'http://',
                    'https://',
                ],
            )
        ) {
            return $avatar;
        }

        if (Str::startsWith($avatar, '/storage/')) {
            return url($avatar);
        }

        /** @var FilesystemAdapter $disk */
        $disk = Storage::disk('public');

        $avatarUrl = $disk->url(
            ltrim($avatar, '/'),
        );

        return Str::startsWith(
            $avatarUrl,
            [
                'http://',
                'https://',
            ],
        )
            ? $avatarUrl
            : url($avatarUrl);
    }
}
