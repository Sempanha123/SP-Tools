<?php

namespace App\Enums;

enum ArticleStatus: string
{
    case Draft = 'draft';
    case Reviewing = 'reviewing';
    case Scheduled = 'scheduled';
    case Published = 'published';
    case Archived = 'archived';

    /*
    |--------------------------------------------------------------------------
    | Display label
    |--------------------------------------------------------------------------
    */

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Draft',
            self::Reviewing => 'Reviewing',
            self::Scheduled => 'Scheduled',
            self::Published => 'Published',
            self::Archived => 'Archived',
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Description
    |--------------------------------------------------------------------------
    */

    public function description(): string
    {
        return match ($this) {
            self::Draft =>
                'The article is still being written and is not public.',

            self::Reviewing =>
                'The article is waiting for editorial review.',

            self::Scheduled =>
                'The article will be published automatically at a future time.',

            self::Published =>
                'The article is visible through the public news API.',

            self::Archived =>
                'The article has been removed from active public coverage.',
        };
    }

    /*
    |--------------------------------------------------------------------------
    | UI badge color
    |--------------------------------------------------------------------------
    |
    | These values can later be used by Filament status badges.
    |
    */

    public function color(): string
    {
        return match ($this) {
            self::Draft => 'gray',
            self::Reviewing => 'warning',
            self::Scheduled => 'info',
            self::Published => 'success',
            self::Archived => 'danger',
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Select options
    |--------------------------------------------------------------------------
    |
    | Returns:
    |
    | [
    |     'draft' => 'Draft',
    |     'reviewing' => 'Reviewing',
    |     ...
    | ]
    |
    */

    public static function options(): array
    {
        $options = [];

        foreach (self::cases() as $status) {
            $options[$status->value] = $status->label();
        }

        return $options;
    }

    /*
    |--------------------------------------------------------------------------
    | Public visibility
    |--------------------------------------------------------------------------
    */

    public function isPublic(): bool
    {
        return $this === self::Published;
    }

    /*
    |--------------------------------------------------------------------------
    | Status transitions
    |--------------------------------------------------------------------------
    */

    public function canTransitionTo(
        self $newStatus,
    ): bool {
        if ($this === $newStatus) {
            return true;
        }

        return in_array(
            $newStatus,
            $this->allowedTransitions(),
            true,
        );
    }

    public function allowedTransitions(): array
    {
        return match ($this) {
            self::Draft => [
                self::Reviewing,
                self::Scheduled,
                self::Published,
                self::Archived,
            ],

            self::Reviewing => [
                self::Draft,
                self::Scheduled,
                self::Published,
                self::Archived,
            ],

            self::Scheduled => [
                self::Draft,
                self::Reviewing,
                self::Published,
                self::Archived,
            ],

            self::Published => [
                self::Draft,
                self::Archived,
            ],

            self::Archived => [
                self::Draft,
            ],
        };
    }
}