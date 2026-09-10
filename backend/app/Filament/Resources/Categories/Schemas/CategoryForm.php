<?php

namespace App\Filament\Resources\Categories\Schemas;

use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class CategoryForm
{
    public static function configure(
        Schema $schema,
    ): Schema {
        return $schema
            ->components([
                Section::make('Category information')
                    ->description(
                        'Create and organize categories used by news articles.',
                    )
                    ->schema([
                        TextInput::make('name')
                            ->label('Category name')
                            ->placeholder('Technology')
                            ->required()
                            ->maxLength(100)
                            ->live(onBlur: true)
                            ->afterStateUpdated(
                                function (
                                    ?string $state,
                                    Set $set,
                                ): void {
                                    $set(
                                        'slug',
                                        Str::slug(
                                            $state ?? '',
                                        ),
                                    );
                                },
                            ),

                        TextInput::make('slug')
                            ->label('URL slug')
                            ->placeholder('technology')
                            ->helperText(
                                'Used in URLs such as /news/category/technology.',
                            )
                            ->required()
                            ->maxLength(191)
                            ->unique(
                                ignoreRecord: true,
                            ),

                        Textarea::make('description')
                            ->placeholder(
                                'Technology, artificial intelligence and digital developments.',
                            )
                            ->rows(4)
                            ->maxLength(2000)
                            ->columnSpanFull(),
                    ])
                    ->columns(2),

                Section::make('Display settings')
                    ->description(
                        'Control how this category appears on the website.',
                    )
                    ->schema([
                        TextInput::make('icon')
                            ->placeholder('cpu')
                            ->maxLength(100)
                            ->helperText(
                                'Store an icon name such as globe, cpu, leaf or heart.',
                            ),

                        TextInput::make('color')
                            ->placeholder('cyan')
                            ->maxLength(50)
                            ->datalist([
                                'slate',
                                'red',
                                'orange',
                                'amber',
                                'yellow',
                                'lime',
                                'green',
                                'emerald',
                                'teal',
                                'cyan',
                                'sky',
                                'blue',
                                'indigo',
                                'violet',
                                'purple',
                                'fuchsia',
                                'pink',
                                'rose',
                            ]),

                        TextInput::make('sort_order')
                            ->label('Display order')
                            ->numeric()
                            ->minValue(0)
                            ->default(0)
                            ->required()
                            ->helperText(
                                'Lower numbers appear first.',
                            ),

                        Toggle::make('is_active')
                            ->label('Active category')
                            ->helperText(
                                'Inactive categories will later be hidden from the public API.',
                            )
                            ->default(true)
                            ->inline(false),
                    ])
                    ->columns(2),
            ]);
    }
}
