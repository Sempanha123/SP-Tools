<?php

namespace App\Http\Resources\Api\V1;

use App\Models\Article;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/** @mixin Article */
class ArticleResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        $isDetailPage = $request->routeIs('api.v1.news.show');
        $authorName = $this->author?->name ?? 'SP-Tools News';
        $authorSlug = $this->author?->slug ?: Str::slug($authorName);

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'excerpt' => $this->excerpt,
            'lead' => $this->when($isDetailPage, $this->lead),

            'image' => $this->publicAssetUrl($this->cover_image),
            'imageCaption' => $this->when($isDetailPage, $this->image_caption),
            'imageCredit' => $this->when($isDetailPage, $this->image_credit),

            'category' => $this->category?->slug,
            'categoryName' => $this->category?->name,
            'region' => $this->region,
            'location' => $this->location,
            'author' => $authorName,
            'authorSlug' => $authorSlug,
            'source' => $this->source,

            'publishedAt' => $this->published_at?->toISOString(),
            'updatedAt' => $this->updated_at?->toISOString(),
            'readTime' => sprintf('%d min read', $this->read_time_minutes),
            'readTimeMinutes' => $this->read_time_minutes,
            'views' => $this->views,
            'isFeatured' => $this->is_featured,
            'isBreaking' => $this->is_breaking,
            'isLive' => $this->is_live,

            'tags' => $this->tags->pluck('name')->values()->all(),
            'tagSlugs' => $this->tags->pluck('slug')->values()->all(),

            'sections' => $this->when($isDetailPage, fn (): array => $this->sectionsWithImageUrls()),
            'keyPoints' => $this->when($isDetailPage, $this->key_points ?? []),
            'timeline' => $this->when($isDetailPage, $this->timeline ?? []),
            'sources' => $this->when($isDetailPage, $this->sources ?? []),
            'methodologyNote' => $this->when($isDetailPage, $this->methodology_note),
            'correctionNote' => $this->when($isDetailPage, $this->correction_note),

            'metaTitle' => $this->when($isDetailPage, $this->meta_title ?: $this->title),
            'metaDescription' => $this->when($isDetailPage, $this->meta_description ?: $this->excerpt),
            'canonicalUrl' => $this->when($isDetailPage, $this->canonical_url),
        ];
    }

    /** @return array<int, array<string, mixed>> */
    private function sectionsWithImageUrls(): array
    {
        if (! is_array($this->sections)) {
            return [];
        }

        return collect($this->sections)
            ->filter(fn ($section): bool => is_array($section))
            ->map(function (array $section): array {
                $image = $section['image'] ?? null;
                $section['image'] = $this->publicAssetUrl(is_string($image) ? $image : null);
                $gallery = $section['gallery'] ?? [];
                $section['gallery'] = is_array($gallery)
                    ? collect($gallery)
                        ->filter(fn ($item): bool => is_string($item) && filled($item))
                        ->map(fn (string $item): ?string => $this->publicAssetUrl($item))
                        ->filter()
                        ->values()
                        ->all()
                    : [];

                $youtubeUrl = $section['youtubeUrl'] ?? null;
                $section['youtubeUrl'] = is_string($youtubeUrl) && filled($youtubeUrl)
                    ? $youtubeUrl
                    : null;

                $youtubeCaption = $section['youtubeCaption'] ?? null;
                $section['youtubeCaption'] = is_string($youtubeCaption) && filled($youtubeCaption)
                    ? $youtubeCaption
                    : null;
                $section['imageAlt'] = $section['imageAlt'] ?? null;
                $section['imageCaption'] = $section['imageCaption'] ?? null;
                $section['imageCredit'] = $section['imageCredit'] ?? null;
                $position = $section['imagePosition'] ?? 'after';
                $section['imagePosition'] = in_array($position, ['before', 'after'], true) ? $position : 'after';

                return $section;
            })
            ->values()
            ->all();
    }

    private function publicAssetUrl(?string $path): ?string
    {
        if (blank($path)) {
            return null;
        }

        if (Str::startsWith($path, ['http://', 'https://'])) {
            return $path;
        }

        // Returning `/storage/...` directly makes a separate Nuxt origin try
        // to load the image from the frontend server. Always make it absolute.
        if (Str::startsWith($path, '/storage/')) {
            return url($path);
        }

        /** @var FilesystemAdapter $disk */
        $disk = Storage::disk('public');
        $assetUrl = $disk->url(ltrim($path, '/'));

        return Str::startsWith($assetUrl, ['http://', 'https://'])
            ? $assetUrl
            : url($assetUrl);
    }
}
