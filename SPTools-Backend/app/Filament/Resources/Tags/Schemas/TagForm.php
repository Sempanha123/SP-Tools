<?php

namespace App\Filament\Resources\Tags\Schemas;

use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class TagForm
{
    public static function configure(
        Schema $schema,
    ): Schema {
        return $schema
            ->components([
                Section::make('Tag information')
                    ->description(
                        'Create a tag used to organize and connect related news stories.',
                    )
                    ->schema([
                        TextInput::make('name')
                            ->label('Tag name')
                            ->placeholder('Artificial Intelligence')
                            ->required()
                            ->maxLength(100)
                            ->live(onBlur: true)
                            ->afterStateUpdated(
                                function (
                                    ?string $state,
                                    Get $get,
                                    Set $set,
                                ): void {
                                    /*
                                     * Only generate the slug when it is empty.
                                     * This prevents changing an existing URL
                                     * when editing the tag name.
                                     */
                                    if (
                                        blank(
                                            $get('slug'),
                                        )
                                    ) {
                                        $set(
                                            'slug',
                                            Str::slug(
                                                $state ?? '',
                                            ),
                                        );
                                    }
                                },
                            ),

                        TextInput::make('slug')
                            ->label('URL slug')
                            ->placeholder(
                                'artificial-intelligence',
                            )
                            ->helperText(
                                'Used in URLs such as /news/tag/artificial-intelligence.',
                            )
                            ->required()
                            ->maxLength(191)
                            ->unique(
                                ignoreRecord: true,
                            ),

                        Textarea::make('description')
                            ->label('Description')
                            ->placeholder(
                                'News, analysis and reports related to artificial intelligence.',
                            )
                            ->rows(5)
                            ->maxLength(2000)
                            ->columnSpanFull(),
                    ])
                    ->columns(2),
            ]);
    }
}