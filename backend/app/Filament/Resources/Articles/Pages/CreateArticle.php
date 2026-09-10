<?php

namespace App\Filament\Resources\Articles\Pages;

use App\Filament\Resources\Articles\ArticleResource;
use App\Filament\Resources\Articles\Concerns\NormalizesArticlePublishingData;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Facades\Auth;

class CreateArticle extends CreateRecord
{
    use NormalizesArticlePublishingData;

    protected static string $resource =
        ArticleResource::class;

    /**
     * @param array<string, mixed> $data
     * @return array<string, mixed>
     */
    protected function mutateFormDataBeforeCreate(
        array $data,
    ): array {
        $data['author_id'] ??= Auth::id();

        return $this
            ->normalizeArticlePublishingData(
                $data,
            );
    }

    protected function getRedirectUrl(): string
    {
        return static::getResource()::getUrl(
            'edit',
            [
                'record' => $this->record,
            ],
        );
    }
}