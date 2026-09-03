<?php

namespace App\Filament\Resources\Articles\Pages;

use App\Filament\Resources\Articles\ArticleResource;
use App\Filament\Resources\Articles\Concerns\NormalizesArticlePublishingData;
use App\Models\Article;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Resources\Pages\EditRecord;
use Filament\Support\Icons\Heroicon;

class EditArticle extends EditRecord
{
    use NormalizesArticlePublishingData;

    protected static string $resource =
        ArticleResource::class;

    /**
     * @param array<string, mixed> $data
     * @return array<string, mixed>
     */
    protected function mutateFormDataBeforeSave(
        array $data,
    ): array {
        /** @var Article $article */
        $article = $this->getRecord();

        return $this
            ->normalizeArticlePublishingData(
                $data,
                $article,
            );
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('openWebsite')
                ->label('Open website')
                ->icon(
                    Heroicon::OutlinedArrowTopRightOnSquare,
                )
                ->color('gray')
                ->url(
                    fn (): string =>
                        $this->getPublicArticleUrl(),
                )
                ->openUrlInNewTab()
                ->visible(
                    function (): bool {
                        /** @var Article $article */
                        $article =
                            $this->getRecord();

                        return !$article->trashed()
                            && $article
                                ->isPubliclyVisible();
                    },
                ),

            DeleteAction::make()
                ->requiresConfirmation(),

            ForceDeleteAction::make()
                ->requiresConfirmation(),

            RestoreAction::make(),
        ];
    }

    private function getPublicArticleUrl(): string
    {
        /** @var Article $article */
        $article = $this->getRecord();

        $frontendUrl = rtrim(
            (string) config(
                'news.frontend_url',
            ),
            '/',
        );

        return sprintf(
            '%s/news/posts/%s',
            $frontendUrl,
            $article->slug,
        );
    }
}