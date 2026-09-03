<?php

namespace App\Enums;

enum UserRole: string
{
    case Admin = 'admin';
    case Editor = 'editor';
    case Author = 'author';

    public function label(): string
    {
        return match ($this) {
            self::Admin => 'Administrator',
            self::Editor => 'Editor',
            self::Author => 'Author',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Admin => 'danger',
            self::Editor => 'warning',
            self::Author => 'info',
        };
    }

    public static function options(): array
    {
        $options = [];

        foreach (self::cases() as $role) {
            $options[$role->value] =
                $role->label();
        }

        return $options;
    }

    public function canManageUsers(): bool
    {
        return $this === self::Admin;
    }

    public function canPublishArticles(): bool
    {
        return in_array(
            $this,
            [
                self::Admin,
                self::Editor,
            ],
            true,
        );
    }

    public function canWriteArticles(): bool
    {
        return true;
    }
}