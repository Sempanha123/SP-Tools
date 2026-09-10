<?php

namespace App\Filament\Resources\Tags\Tables;

use App\Models\Tag;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class TagsTable
{
    public static function configure(
        Table $table,
    ): Table {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->label('Tag')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('slug')
                    ->label('Slug')
                    ->searchable()
                    ->copyable()
                    ->toggleable(),

                TextColumn::make('articles_count')
                    ->label('Articles')
                    ->counts('articles')
                    ->badge()
                    ->sortable(),

                TextColumn::make('description')
                    ->label('Description')
                    ->placeholder('No description')
                    ->limit(70)
                    ->wrap()
                    ->toggleable(),

                TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime(
                        format: 'M j, Y g:i A',
                    )
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
            ->defaultSort(
                'name',
                'asc',
            )
            ->recordActions([
                EditAction::make(),

                DeleteAction::make()
                    ->requiresConfirmation()
                    ->disabled(
                        fn (
                            Tag $record,
                        ): bool => $record
                            ->articles()
                            ->exists(),
                    )
                    ->tooltip(
                        fn (
                            Tag $record,
                        ): ?string => $record
                            ->articles()
                            ->exists()
                                ? 'Remove this tag from its articles before deleting it.'
                                : null,
                    ),
            ])
            ->emptyStateHeading(
                'No tags found',
            )
            ->emptyStateDescription(
                'Create your first news tag.',
            );
    }
}