<?php

namespace App\Filament\Resources\Categories\Tables;

use App\Models\Category;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class CategoriesTable
{
    public static function configure(
        Table $table,
    ): Table {
        return $table
            ->columns([
                TextColumn::make('sort_order')
                    ->label('Order')
                    ->sortable(),

                TextColumn::make('name')
                    ->label('Category')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                TextColumn::make('slug')
                    ->label('Slug')
                    ->searchable()
                    ->copyable()
                    ->toggleable(),

                TextColumn::make('articles_count')
                    ->label('Articles')
                    ->counts('articles')
                    ->sortable()
                    ->badge(),

                TextColumn::make('color')
                    ->label('Color')
                    ->placeholder('Not set')
                    ->badge()
                    ->toggleable(),

                IconColumn::make('is_active')
                    ->label('Active')
                    ->boolean()
                    ->sortable(),

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
                TernaryFilter::make('is_active')
                    ->label('Active status')
                    ->trueLabel('Active categories')
                    ->falseLabel('Inactive categories')
                    ->placeholder('All categories'),
            ])
            ->defaultSort(
                'sort_order',
                'asc',
            )
            ->recordActions([
                EditAction::make(),

                DeleteAction::make()
                    ->requiresConfirmation()
                    ->disabled(
                        fn(
                            Category $record,
                        ): bool => $record
                            ->articles()
                            ->exists(),
                    )
                    ->tooltip(
                        fn(
                            Category $record,
                        ): ?string => $record
                            ->articles()
                            ->exists()
                            ? 'Move or delete this category’s articles before deleting the category.'
                            : null,
                    ),
            ])
            ->emptyStateHeading(
                'No categories found',
            )
            ->emptyStateDescription(
                'Create your first news category.',
            );
    }
}
