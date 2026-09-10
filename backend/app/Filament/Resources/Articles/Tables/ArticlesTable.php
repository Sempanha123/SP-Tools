<?php

namespace App\Filament\Resources\Articles\Tables;

use App\Enums\ArticleStatus;
use App\Models\Article;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;

class ArticlesTable
{
    public static function configure(
        Table $table,
    ): Table {
        return $table
            ->columns([
                TextColumn::make('title')
                    ->label('Article')
                    ->searchable()
                    ->sortable()
                    ->weight('bold')
                    ->limit(70)
                    ->tooltip(
                        fn (
                            Article $record,
                        ): string => $record->title,
                    ),

                TextColumn::make('category.name')
                    ->label('Category')
                    ->badge()
                    ->searchable()
                    ->sortable(),

                TextColumn::make('author.name')
                    ->label('Author')
                    ->searchable()
                    ->sortable()
                    ->toggleable(),

                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->formatStateUsing(
                        fn (
                            ArticleStatus|string|null $state,
                        ): string =>
                            self::statusLabel(
                                $state,
                            ),
                    )
                    ->color(
                        fn (
                            ArticleStatus|string|null $state,
                        ): string =>
                            self::statusColor(
                                $state,
                            ),
                    )
                    ->sortable(),

                TextColumn::make('tags.name')
                    ->label('Tags')
                    ->badge()
                    ->listWithLineBreaks()
                    ->limitList(3)
                    ->expandableLimitedList()
                    ->toggleable(),

                IconColumn::make('is_featured')
                    ->label('Featured')
                    ->boolean()
                    ->sortable()
                    ->toggleable(),

                IconColumn::make('is_breaking')
                    ->label('Breaking')
                    ->boolean()
                    ->sortable()
                    ->toggleable(),

                IconColumn::make('is_live')
                    ->label('Live')
                    ->boolean()
                    ->sortable()
                    ->toggleable(
                        isToggledHiddenByDefault: true,
                    ),

                TextColumn::make('views')
                    ->label('Views')
                    ->numeric()
                    ->sortable()
                    ->toggleable(),

                TextColumn::make(
                    'read_time_minutes',
                )
                    ->label('Read time')
                    ->suffix(' min')
                    ->sortable()
                    ->toggleable(
                        isToggledHiddenByDefault: true,
                    ),

                TextColumn::make('published_at')
                    ->label('Published')
                    ->dateTime(
                        format: 'M j, Y g:i A',
                    )
                    ->placeholder('Not published')
                    ->sortable(),

                TextColumn::make('scheduled_at')
                    ->label('Scheduled')
                    ->dateTime(
                        format: 'M j, Y g:i A',
                    )
                    ->placeholder('Not scheduled')
                    ->sortable()
                    ->toggleable(
                        isToggledHiddenByDefault: true,
                    ),

                TextColumn::make('updated_at')
                    ->label('Updated')
                    ->dateTime(
                        format: 'M j, Y g:i A',
                    )
                    ->sortable()
                    ->toggleable(
                        isToggledHiddenByDefault: true,
                    ),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->label('Article status')
                    ->options(
                        ArticleStatus::options(),
                    )
                    ->multiple(),

                SelectFilter::make('category')
                    ->label('Category')
                    ->relationship(
                        name: 'category',
                        titleAttribute: 'name',
                    )
                    ->searchable()
                    ->preload(),

                SelectFilter::make('author')
                    ->label('Author')
                    ->relationship(
                        name: 'author',
                        titleAttribute: 'name',
                    )
                    ->searchable()
                    ->preload(),

                TernaryFilter::make('is_featured')
                    ->label('Featured')
                    ->trueLabel(
                        'Featured articles',
                    )
                    ->falseLabel(
                        'Not featured',
                    )
                    ->placeholder(
                        'All articles',
                    ),

                TernaryFilter::make('is_breaking')
                    ->label('Breaking news')
                    ->trueLabel(
                        'Breaking articles',
                    )
                    ->falseLabel(
                        'Not breaking',
                    )
                    ->placeholder(
                        'All articles',
                    ),

                TernaryFilter::make('is_live')
                    ->label('Live coverage')
                    ->trueLabel(
                        'Live articles',
                    )
                    ->falseLabel(
                        'Not live',
                    )
                    ->placeholder(
                        'All articles',
                    ),

                TrashedFilter::make(),
            ])
            ->defaultSort(
                'updated_at',
                'desc',
            )
            ->recordActions([
                Action::make('openWebsite')
                    ->label('Open')
                    ->icon(
                        Heroicon::OutlinedArrowTopRightOnSquare,
                    )
                    ->color('gray')
                    ->url(
                        fn (
                            Article $record,
                        ): string =>
                            self::publicArticleUrl(
                                $record,
                            ),
                    )
                    ->openUrlInNewTab()
                    ->visible(
                        fn (
                            Article $record,
                        ): bool =>
                            !$record->trashed()
                            && $record
                                ->isPubliclyVisible(),
                    ),

                EditAction::make(),

                DeleteAction::make()
                    ->requiresConfirmation(),

                ForceDeleteAction::make()
                    ->requiresConfirmation(),

                RestoreAction::make(),
            ])
            ->emptyStateHeading(
                'No articles found',
            )
            ->emptyStateDescription(
                'Create your first news article.',
            );
    }

    private static function statusLabel(
        ArticleStatus|string|null $status,
    ): string {
        $status = self::resolveStatus(
            $status,
        );

        return $status?->label()
            ?? 'Unknown';
    }

    private static function statusColor(
        ArticleStatus|string|null $status,
    ): string {
        $status = self::resolveStatus(
            $status,
        );

        return $status?->color()
            ?? 'gray';
    }

    private static function resolveStatus(
        ArticleStatus|string|null $status,
    ): ?ArticleStatus {
        if ($status instanceof ArticleStatus) {
            return $status;
        }

        if (blank($status)) {
            return null;
        }

        return ArticleStatus::tryFrom(
            (string) $status,
        );
    }

    private static function publicArticleUrl(
        Article $article,
    ): string {
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