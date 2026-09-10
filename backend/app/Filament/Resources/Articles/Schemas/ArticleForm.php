<?php

namespace App\Filament\Resources\Articles\Schemas;

use App\Enums\ArticleStatus;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class ArticleForm
{
    public static function configure(
        Schema $schema,
    ): Schema {
        return $schema
            ->components([
                Tabs::make('Article editor')
                    ->tabs([
                        self::basicInformationTab(),
                        self::coverImageTab(),
                        self::contentTab(),
                        self::publishingTab(),
                        self::seoTab(),
                    ])
                    ->persistTabInQueryString()
                    ->columnSpanFull(),
            ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Basic information
    |--------------------------------------------------------------------------
    */

    private static function basicInformationTab(): Tab
    {
        return Tab::make('Basic information')
            ->schema([
                Section::make('Story details')
                    ->description(
                        'Enter the main information shown on article cards and pages.',
                    )
                    ->schema([
                        TextInput::make('title')
                            ->label('Article title')
                            ->placeholder(
                                'Regional leaders prepare for international summit',
                            )
                            ->required()
                            ->maxLength(191)
                            ->live(onBlur: true)
                            ->afterStateUpdated(
                                function (
                                    ?string $state,
                                    Get $get,
                                    Set $set,
                                ): void {
                                    if (blank($get('slug'))) {
                                        $set(
                                            'slug',
                                            Str::slug(
                                                $state ?? '',
                                            ),
                                        );
                                    }
                                },
                            )
                            ->columnSpanFull(),

                        TextInput::make('slug')
                            ->label('URL slug')
                            ->placeholder(
                                'regional-leaders-prepare-for-international-summit',
                            )
                            ->helperText(
                                'Used in the public article URL.',
                            )
                            ->required()
                            ->maxLength(191)
                            ->unique(
                                ignoreRecord: true,
                            )
                            ->columnSpanFull(),

                        Textarea::make('excerpt')
                            ->label('Short excerpt')
                            ->placeholder(
                                'Write a short summary for article cards and search results.',
                            )
                            ->helperText(
                                'Keep this clear and suitable for article cards.',
                            )
                            ->required()
                            ->rows(4)
                            ->maxLength(1000)
                            ->columnSpanFull(),

                        Textarea::make('lead')
                            ->label('Article lead')
                            ->placeholder(
                                'Write the opening summary of the full article.',
                            )
                            ->rows(6)
                            ->maxLength(5000)
                            ->columnSpanFull(),
                    ])
                    ->columns(2),

                Section::make('Classification')
                    ->description(
                        'Choose the article author, category, and related tags.',
                    )
                    ->schema([
                        Select::make('author_id')
                            ->label('Author')
                            ->relationship(
                                name: 'author',
                                titleAttribute: 'name',
                            )
                            ->searchable([
                                'name',
                                'email',
                            ])
                            ->preload()
                            ->default(
                                fn(): ?int => Auth::id(),
                            )
                            ->required(),

                        Select::make('category_id')
                            ->label('Category')
                            ->relationship(
                                name: 'category',
                                titleAttribute: 'name',
                            )
                            ->searchable()
                            ->preload()
                            ->required(),

                        Select::make('tags')
                            ->label('Tags')
                            ->relationship(
                                name: 'tags',
                                titleAttribute: 'name',
                            )
                            ->multiple()
                            ->searchable()
                            ->preload()
                            ->helperText(
                                'Select all tags related to this article.',
                            )
                            ->columnSpanFull(),
                    ])
                    ->columns(2),
            ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Cover image
    |--------------------------------------------------------------------------
    */

    private static function coverImageTab(): Tab
    {
        return Tab::make('Cover image')
            ->schema([
                Section::make('Article image')
                    ->description(
                        'Upload the main image shown on cards and article pages.',
                    )
                    ->schema([
                        FileUpload::make('cover_image')
                            ->label('Cover image')
                            ->image()
                            ->disk('public')
                            ->directory('news/covers')
                            ->visibility('public')
                            ->preventFilePathTampering()
                            ->acceptedFileTypes([
                                'image/jpeg',
                                'image/png',
                                'image/webp',
                            ])
                            ->maxSize(5120)
                            ->helperText(
                                'Use JPG, PNG, or WebP. Maximum size: 5 MB.',
                            )
                            ->columnSpanFull(),

                        TextInput::make('image_caption')
                            ->label('Image caption')
                            ->placeholder(
                                'Describe what the image shows.',
                            )
                            ->maxLength(500)
                            ->columnSpanFull(),

                        TextInput::make('image_credit')
                            ->label('Image credit')
                            ->placeholder(
                                'Photographer, agency, or organization',
                            )
                            ->maxLength(191)
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Article content
    |--------------------------------------------------------------------------
    */

    private static function contentTab(): Tab
    {
        return Tab::make('Article content')
            ->schema([
                Section::make('Key points')
                    ->description(
                        'Add the most important facts readers should understand.',
                    )
                    ->schema([
                        TagsInput::make('key_points')
                            ->label('Key points')
                            ->placeholder(
                                'Type a key point and press Enter',
                            )
                            ->helperText(
                                'Each entered item becomes one key point.',
                            )
                            ->columnSpanFull(),
                    ]),

                Section::make('Article sections')
                    ->description(
                        'Create the main structured sections of the article.',
                    )
                    ->schema([
                        Repeater::make('sections')
                            ->label('Sections')
                            ->schema([
                                TextInput::make('title')
                                    ->label('Section title')
                                    ->placeholder(
                                        'What we know',
                                    )
                                    ->required()
                                    ->maxLength(191)
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(
                                        function (
                                            ?string $state,
                                            Get $get,
                                            Set $set,
                                        ): void {
                                            if (
                                                blank(
                                                    $get('id'),
                                                )
                                            ) {
                                                $set(
                                                    'id',
                                                    Str::slug(
                                                        $state ?? '',
                                                    ),
                                                );
                                            }
                                        },
                                    ),

                                TextInput::make('id')
                                    ->label('Section ID')
                                    ->placeholder(
                                        'what-we-know',
                                    )
                                    ->helperText(
                                        'Used by the article table of contents.',
                                    )
                                    ->required()
                                    ->maxLength(191),

                                TagsInput::make('paragraphs')
                                    ->label('Paragraphs')
                                    ->placeholder(
                                        'Type a paragraph and press Enter',
                                    )
                                    ->helperText(
                                        'Add each paragraph as a separate item.',
                                    )
                                    ->required()
                                    ->columnSpanFull(),

                                FileUpload::make('image')
                                    ->label('Section image')
                                    ->image()
                                    ->disk('public')
                                    ->directory('news/sections')
                                    ->visibility('public')
                                    ->preventFilePathTampering(false)
                                    ->acceptedFileTypes([
                                        'image/jpeg',
                                        'image/png',
                                        'image/webp',
                                    ])
                                    ->maxSize(5120)
                                    ->helperText(
                                        'Optional image for this section. Maximum size: 5 MB.',
                                    )
                                    ->columnSpanFull(),

                                TextInput::make('imageAlt')
                                    ->label('Image alt text')
                                    ->placeholder(
                                        'Describe what is visible in the image',
                                    )
                                    ->maxLength(255)
                                    ->columnSpanFull(),

                                TextInput::make('imageCaption')
                                    ->label('Image caption')
                                    ->placeholder(
                                        'Caption displayed below the image',
                                    )
                                    ->maxLength(500)
                                    ->columnSpanFull(),

                                TextInput::make('imageCredit')
                                    ->label('Image credit')
                                    ->placeholder(
                                        'Photographer, agency, or organization',
                                    )
                                    ->maxLength(191),

                                Select::make('imagePosition')
                                    ->label('Image position')
                                    ->options([
                                        'before' =>
                                        'Before section content',
                                        'after' =>
                                        'After section content',
                                    ])
                                    ->default('after')
                                    ->native(false),

                                FileUpload::make('gallery')
                                    ->label('Additional images')
                                    ->image()
                                    ->multiple()
                                    ->reorderable()
                                    ->appendFiles()
                                    ->disk('public')
                                    ->directory('news/sections/gallery')
                                    ->visibility('public')
                                    ->preventFilePathTampering(false)
                                    ->acceptedFileTypes([
                                        'image/jpeg',
                                        'image/png',
                                        'image/webp',
                                    ])
                                    ->maxFiles(8)
                                    ->maxSize(5120)
                                    ->helperText(
                                        'Optional gallery for this section. Up to 8 images, 5 MB each.',
                                    )
                                    ->columnSpanFull(),

                                TextInput::make('youtubeUrl')
                                    ->label('YouTube video URL')
                                    ->url()
                                    ->placeholder(
                                        'https://www.youtube.com/watch?v=...',
                                    )
                                    ->helperText(
                                        'Optional. Supports YouTube watch, youtu.be, Shorts, Live, and embed URLs.',
                                    )
                                    ->maxLength(500)
                                    ->columnSpanFull(),

                                TextInput::make('youtubeCaption')
                                    ->label('YouTube caption')
                                    ->placeholder(
                                        'Short context for the embedded video',
                                    )
                                    ->maxLength(500)
                                    ->columnSpanFull(),

                                TagsInput::make('bullets')
                                    ->label('Bullet points')
                                    ->placeholder(
                                        'Type a bullet point and press Enter',
                                    )
                                    ->columnSpanFull(),

                                Textarea::make('quote')
                                    ->label('Optional quote')
                                    ->rows(3)
                                    ->columnSpanFull(),

                                TextInput::make(
                                    'quoteAttribution',
                                )
                                    ->label(
                                        'Quote attribution',
                                    )
                                    ->placeholder(
                                        'Name or organization',
                                    )
                                    ->maxLength(191),

                                Textarea::make('note')
                                    ->label('Optional note')
                                    ->rows(3)
                                    ->columnSpanFull(),
                            ])
                            ->columns(2)
                            ->addActionLabel(
                                'Add article section',
                            )
                            ->collapsible()
                            ->reorderableWithButtons()
                            ->defaultItems(0)
                            ->columnSpanFull(),
                    ]),

                Section::make('Timeline')
                    ->description(
                        'Add chronological updates when the story needs a timeline.',
                    )
                    ->schema([
                        Repeater::make('timeline')
                            ->label('Timeline entries')
                            ->schema([
                                TextInput::make('time')
                                    ->label('Time or date')
                                    ->placeholder(
                                        '8:30 AM',
                                    )
                                    ->maxLength(100),

                                TextInput::make('title')
                                    ->label('Update title')
                                    ->required()
                                    ->maxLength(191),

                                Textarea::make(
                                    'description',
                                )
                                    ->label('Description')
                                    ->required()
                                    ->rows(3)
                                    ->columnSpanFull(),
                            ])
                            ->columns(2)
                            ->addActionLabel(
                                'Add timeline entry',
                            )
                            ->collapsible()
                            ->reorderableWithButtons()
                            ->defaultItems(0)
                            ->columnSpanFull(),
                    ]),

                Section::make('Sources')
                    ->description(
                        'List primary documents, official statements, and other reporting sources.',
                    )
                    ->schema([
                        Repeater::make('sources')
                            ->label('Article sources')
                            ->schema([
                                TextInput::make('name')
                                    ->label('Source name')
                                    ->required()
                                    ->maxLength(191),

                                TextInput::make('type')
                                    ->label('Source type')
                                    ->placeholder(
                                        'Primary source',
                                    )
                                    ->maxLength(100),

                                Textarea::make(
                                    'description',
                                )
                                    ->label('Description')
                                    ->rows(3)
                                    ->columnSpanFull(),

                                TextInput::make('url')
                                    ->label('Source URL')
                                    ->url()
                                    ->maxLength(500)
                                    ->columnSpanFull(),
                            ])
                            ->columns(2)
                            ->addActionLabel(
                                'Add source',
                            )
                            ->collapsible()
                            ->reorderableWithButtons()
                            ->defaultItems(0)
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Publishing
    |--------------------------------------------------------------------------
    */

    private static function publishingTab(): Tab
    {
        return Tab::make('Publishing')
            ->schema([
                Section::make('Publication status')
                    ->description(
                        'Control when and how this story appears publicly.',
                    )
                    ->schema([
                        Select::make('status')
                            ->label('Article status')
                            ->options(
                                ArticleStatus::options(),
                            )
                            ->default(
                                ArticleStatus::Draft->value,
                            )
                            ->selectablePlaceholder(false)
                            ->live()
                            ->required(),

                        DateTimePicker::make('scheduled_at')
                            ->label('Scheduled publication')
                            ->helperText(
                                'Required when status is Scheduled.',
                            )
                            ->native(false)
                            ->seconds(false)
                            ->minDate(
                                fn(Get $get) =>
                                $get('status')
                                    === ArticleStatus::Scheduled->value
                                    ? now()->addMinute()
                                    : null,
                            )
                            ->visible(
                                fn(Get $get): bool =>
                                $get('status')
                                    === ArticleStatus::Scheduled->value,
                            )
                            ->required(
                                fn(Get $get): bool =>
                                $get('status')
                                    === ArticleStatus::Scheduled->value,
                            ),

                        DateTimePicker::make('published_at')
                            ->label('Publication date')
                            ->helperText(
                                'Leave blank to use the current time when publishing.',
                            )
                            ->native(false)
                            ->seconds(false)
                            ->maxDate(
                                fn() => now(),
                            ),

                        TextInput::make(
                            'read_time_minutes',
                        )
                            ->label(
                                'Reading time',
                            )
                            ->numeric()
                            ->minValue(1)
                            ->maxValue(300)
                            ->default(1)
                            ->required()
                            ->suffix('minutes'),

                        TextInput::make('views')
                            ->label('Article Views')
                            ->numeric()
                            ->minValue(0)
                            ->step(1)
                            ->default(0)
                            ->required()
                            ->suffix('views')
                            ->helperText(
                                'Enter the current number of views for this article.',
                            )
                            ->dehydrateStateUsing(
                                fn($state): int => max(
                                    0,
                                    (int) ($state ?? 0),
                                ),
                            ),
                    ])
                    ->columns(2),

                Section::make('Location and publisher')
                    ->schema([
                        TextInput::make('region')
                            ->placeholder('Asia')
                            ->default('Global')
                            ->required()
                            ->maxLength(100),

                        TextInput::make('location')
                            ->placeholder(
                                'Phnom Penh, Cambodia',
                            )
                            ->maxLength(191),

                        TextInput::make('source')
                            ->label('Publisher/source')
                            ->default('SP-Tools News')
                            ->required()
                            ->maxLength(191)
                            ->columnSpanFull(),
                    ])
                    ->columns(2),

                Section::make('Display options')
                    ->schema([
                        Toggle::make('is_featured')
                            ->label('Featured article')
                            ->helperText(
                                'Show this article in featured sections.',
                            )
                            ->default(false),

                        Toggle::make('is_breaking')
                            ->label('Breaking news')
                            ->helperText(
                                'Mark this as an important breaking story.',
                            )
                            ->default(false),

                        Toggle::make('is_live')
                            ->label('Live coverage')
                            ->helperText(
                                'Show that this article is being updated live.',
                            )
                            ->default(false),
                    ])
                    ->columns(3),
            ]);
    }

    /*
    |--------------------------------------------------------------------------
    | SEO and transparency
    |--------------------------------------------------------------------------
    */

    private static function seoTab(): Tab
    {
        return Tab::make('SEO and transparency')
            ->schema([
                Section::make('Search engine information')
                    ->schema([
                        TextInput::make('meta_title')
                            ->label('SEO title')
                            ->placeholder(
                                'Leave blank to use the article title',
                            )
                            ->maxLength(191)
                            ->columnSpanFull(),

                        Textarea::make(
                            'meta_description',
                        )
                            ->label('SEO description')
                            ->placeholder(
                                'Leave blank to use the article excerpt',
                            )
                            ->rows(4)
                            ->maxLength(1000)
                            ->columnSpanFull(),

                        TextInput::make(
                            'canonical_url',
                        )
                            ->label('Canonical URL')
                            ->placeholder(
                                'https://example.com/news/posts/article-slug',
                            )
                            ->url()
                            ->maxLength(500)
                            ->columnSpanFull(),
                    ]),

                Section::make(
                    'Editorial transparency',
                )
                    ->schema([
                        Textarea::make(
                            'methodology_note',
                        )
                            ->label('Methodology note')
                            ->placeholder(
                                'Explain how information was collected and verified.',
                            )
                            ->rows(5)
                            ->columnSpanFull(),

                        Textarea::make(
                            'correction_note',
                        )
                            ->label('Correction note')
                            ->placeholder(
                                'Describe corrections made to the article.',
                            )
                            ->rows(5)
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
