<?php

namespace App\Http\Resources\Api\V1;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Filesystem\FilesystemAdapter;

/**
 * @mixin Article
 */
class ArticleResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(
        Request $request,
    ): array {
        $isDetailPage = $request->routeIs(
            'api.v1.news.show',
        );

        $authorName = $this->author?->name
            ?? 'SP-Tools News';

        return [
            'id' => $this->id,
            'slug' => $this->slug,

            'title' => $this->title,
            'excerpt' => $this->excerpt,

            'lead' => $this->when(
                $isDetailPage,
                $this->lead,
            ),

            /*
            |--------------------------------------------------------------------------
            | Image
            |--------------------------------------------------------------------------
            */

            'image' => $this->coverImageUrl(
                $this->cover_image,
            ),

            'imageCaption' => $this->when(
                $isDetailPage,
                $this->image_caption,
            ),

            'imageCredit' => $this->when(
                $isDetailPage,
                $this->image_credit,
            ),

            /*
            |--------------------------------------------------------------------------
            | Category and author
            |--------------------------------------------------------------------------
            */

            'category' =>
            $this->category?->slug,

            'categoryName' =>
            $this->category?->name,

            'region' => $this->region,
            'location' => $this->location,

            'author' => $authorName,

            'authorSlug' => Str::slug(
                $authorName,
            ),

            'source' => $this->source,

            /*
            |--------------------------------------------------------------------------
            | Publishing information
            |--------------------------------------------------------------------------
            */

            'publishedAt' =>
            $this->published_at
                ?->toISOString(),

            'updatedAt' =>
            $this->updated_at
                ?->toISOString(),

            'readTime' => sprintf(
                '%d min read',
                $this->read_time_minutes,
            ),

            'readTimeMinutes' =>
            $this->read_time_minutes,

            'views' => $this->views,

            'isFeatured' =>
            $this->is_featured,

            'isBreaking' =>
            $this->is_breaking,

            'isLive' =>
            $this->is_live,

            /*
            |--------------------------------------------------------------------------
            | Tags
            |--------------------------------------------------------------------------
            */

            'tags' => $this->tags
                ->pluck('name')
                ->values()
                ->all(),

            'tagSlugs' => $this->tags
                ->pluck('slug')
                ->values()
                ->all(),

            /*
            |--------------------------------------------------------------------------
            | Full article content
            |--------------------------------------------------------------------------
            */

            'sections' => $this->when(
                $isDetailPage,
                fn(): array =>
                $this->sectionsWithImageUrls(),
            ),

            'keyPoints' => $this->when(
                $isDetailPage,
                $this->key_points ?? [],
            ),

            'timeline' => $this->when(
                $isDetailPage,
                $this->timeline ?? [],
            ),

            'sources' => $this->when(
                $isDetailPage,
                $this->sources ?? [],
            ),

            'methodologyNote' =>
            $this->when(
                $isDetailPage,
                $this->methodology_note,
            ),

            'correctionNote' =>
            $this->when(
                $isDetailPage,
                $this->correction_note,
            ),

            /*
            |--------------------------------------------------------------------------
            | SEO
            |--------------------------------------------------------------------------
            */

            'metaTitle' => $this->when(
                $isDetailPage,
                $this->meta_title
                    ?: $this->title,
            ),

            'metaDescription' =>
            $this->when(
                $isDetailPage,
                $this->meta_description
                    ?: $this->excerpt,
            ),

            'canonicalUrl' =>
            $this->when(
                $isDetailPage,
                $this->canonical_url,
            ),
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function sectionsWithImageUrls(): array
    {
        $sections = $this->sections;

        if (! is_array($sections)) {
            return [];
        }

        return collect($sections)
            ->filter(
                fn($section): bool =>
                is_array($section),
            )
            ->map(
                function (
                    array $section,
                ): array {
                    $image = $section['image']
                        ?? null;

                    $section['image'] =
                        $this->sectionImageUrl(
                            is_string($image)
                                ? $image
                                : null,
                        );

                    $section['imageAlt'] =
                        $section['imageAlt']
                        ?? null;

                    $section['imageCaption'] =
                        $section['imageCaption']
                        ?? null;

                    $section['imageCredit'] =
                        $section['imageCredit']
                        ?? null;

                    $imagePosition =
                        $section['imagePosition']
                        ?? 'after';

                    $section['imagePosition'] =
                        in_array(
                            $imagePosition,
                            [
                                'before',
                                'after',
                            ],
                            true,
                        )
                        ? $imagePosition
                        : 'after';

                    return $section;
                },
            )
            ->values()
            ->all();
    }

    private function sectionImageUrl(
        ?string $path,
    ): ?string {
        if (blank($path)) {
            return null;
        }

        if (
            Str::startsWith(
                $path,
                [
                    'http://',
                    'https://',
                ],
            )
        ) {
            return $path;
        }

        if (
            Str::startsWith(
                $path,
                '/storage/',
            )
        ) {
            return $path;
        }

        /** @var FilesystemAdapter $disk */
        $disk = Storage::disk('public');

        return $disk->url(
            ltrim($path, '/'),
        );
    }

    private function coverImageUrl(
        ?string $path,
    ): ?string {
        if (blank($path)) {
            return null;
        }

        if (
            Str::startsWith(
                $path,
                [
                    'http://',
                    'https://',
                ],
            )
        ) {
            return $path;
        }

        if (
            Str::startsWith(
                $path,
                '/storage/',
            )
        ) {
            return $path;
        }

        /** @var FilesystemAdapter $disk */
        $disk = Storage::disk('public');

        return $disk->url(
            ltrim($path, '/'),
        );
    }
}
