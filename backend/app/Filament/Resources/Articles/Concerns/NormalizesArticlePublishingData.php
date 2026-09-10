<?php

namespace App\Filament\Resources\Articles\Concerns;

use App\Enums\ArticleStatus;
use App\Models\Article;
use Illuminate\Support\Carbon;
use Illuminate\Validation\ValidationException;

trait NormalizesArticlePublishingData
{
    /**
     * Normalize and validate publishing fields before
     * Filament creates or updates an article.
     *
     * @param array<string, mixed> $data
     * @return array<string, mixed>
     */
    protected function normalizeArticlePublishingData(
        array $data,
        ?Article $article = null,
    ): array {
        $rawStatus = $data['status']
            ?? ArticleStatus::Draft->value;

        $newStatus = $rawStatus instanceof ArticleStatus
            ? $rawStatus
            : ArticleStatus::tryFrom(
                (string) $rawStatus,
            );

        if (!$newStatus) {
            throw ValidationException::withMessages([
                'data.status' =>
                    'The selected article status is invalid.',
            ]);
        }

        $currentStatus = $article
            ? $article->status
            : ArticleStatus::Draft;

        if (!$currentStatus instanceof ArticleStatus) {
            $currentStatus = ArticleStatus::tryFrom(
                (string) $currentStatus,
            );

            if (!$currentStatus) {
                throw ValidationException::withMessages([
                    'data.status' =>
                        'The article has an invalid current status.',
                ]);
            }
        }

        if (
            !$currentStatus->canTransitionTo(
                $newStatus,
            )
        ) {
            throw ValidationException::withMessages([
                'data.status' => sprintf(
                    'The article cannot move from %s to %s.',
                    $currentStatus->label(),
                    $newStatus->label(),
                ),
            ]);
        }

        $scheduledAt = $this->parseArticleDate(
            $data['scheduled_at'] ?? null,
        );

        $publishedAt = $this->parseArticleDate(
            $data['published_at'] ?? null,
        );

        $data['status'] = $newStatus->value;

        switch ($newStatus) {
            case ArticleStatus::Draft:
                $data['published_at'] = null;
                $data['scheduled_at'] = null;
                $data['is_live'] = false;

                break;

            case ArticleStatus::Reviewing:
                $data['published_at'] = null;
                $data['scheduled_at'] = null;
                $data['is_live'] = false;

                break;

            case ArticleStatus::Scheduled:
                if ($scheduledAt === null) {
                    throw ValidationException::withMessages([
                        'data.scheduled_at' =>
                            'Select a scheduled publication date.',
                    ]);
                }

                if (
                    $scheduledAt->lessThanOrEqualTo(
                        now(),
                    )
                ) {
                    throw ValidationException::withMessages([
                        'data.scheduled_at' =>
                            'The scheduled publication date must be in the future.',
                    ]);
                }

                $data['published_at'] = null;
                $data['scheduled_at'] = $scheduledAt;
                $data['is_live'] = false;

                break;

            case ArticleStatus::Published:
                if (
                    $publishedAt !== null
                    && $publishedAt->isFuture()
                ) {
                    throw ValidationException::withMessages([
                        'data.published_at' =>
                            'A published article cannot use a future publication date.',
                    ]);
                }

                $data['published_at'] =
                    $publishedAt
                    ?? $article?->published_at
                    ?? now();

                $data['scheduled_at'] = null;

                break;

            case ArticleStatus::Archived:
                $data['published_at'] =
                    $publishedAt
                    ?? $article?->published_at;

                $data['scheduled_at'] = null;

                $data['is_featured'] = false;
                $data['is_breaking'] = false;
                $data['is_live'] = false;

                break;
        }

        return $data;
    }

    private function parseArticleDate(
        mixed $value,
    ): ?Carbon {
        if (blank($value)) {
            return null;
        }

        if ($value instanceof Carbon) {
            return $value;
        }

        return Carbon::parse(
            $value,
        );
    }
}