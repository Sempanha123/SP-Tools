<?php

namespace App\Models;

use App\Enums\UserRole;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

class User extends Authenticatable implements FilamentUser
{
    use HasFactory;
    use Notifiable;

    protected $fillable = [
        'name',
        'slug',
        'email',
        'password',

        'role',
        'avatar',
        'bio',
        'location',
        'is_active',
        'is_verified',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $attributes = [
        'role' => 'author',
        'is_active' => true,
        'is_verified' => false,
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',

            'role' => UserRole::class,
            'is_active' => 'boolean',
            'is_verified' => 'boolean',
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Model events
    |--------------------------------------------------------------------------
    */

    protected static function booted(): void
    {
        static::saving(function (User $user): void {
            /*
             * Keep an existing slug unchanged unless
             * the slug itself was manually changed.
             */

            if (
                filled($user->slug)
                && ! $user->isDirty('slug')
            ) {
                return;
            }

            $source = filled($user->slug)
                ? (string) $user->slug
                : (string) $user->name;

            $user->slug = static::generateUniqueSlug(
                $source,
                $user->exists
                    ? (int) $user->getKey()
                    : null,
            );
        });
    }

    private static function generateUniqueSlug(
        string $value,
        ?int $ignoreUserId = null,
    ): string {
        $baseSlug = Str::slug($value)
            ?: 'author';

        $slug = $baseSlug;
        $suffix = 2;

        while (true) {
            $query = static::query()
                ->where('slug', $slug);

            if ($ignoreUserId !== null) {
                $query->where(
                    'id',
                    '!=',
                    $ignoreUserId,
                );
            }

            if (! $query->exists()) {
                return $slug;
            }

            $slug = "{$baseSlug}-{$suffix}";
            $suffix++;
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function articles(): HasMany
    {
        return $this->hasMany(
            Article::class,
            'author_id',
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Role helpers
    |--------------------------------------------------------------------------
    */

    public function isAdmin(): bool
    {
        return $this->role === UserRole::Admin;
    }

    public function isEditor(): bool
    {
        return $this->role === UserRole::Editor;
    }

    public function isAuthor(): bool
    {
        return $this->role === UserRole::Author;
    }

    public function canPublishArticles(): bool
    {
        return $this->role
            ->canPublishArticles();
    }

    /*
    |--------------------------------------------------------------------------
    | Filament access
    |--------------------------------------------------------------------------
    */

    public function canAccessPanel(
        Panel $panel,
    ): bool {
        if ($panel->getId() !== 'admin') {
            return false;
        }

        if (! $this->is_active) {
            return false;
        }

        return in_array(
            $this->role,
            [
                UserRole::Admin,
                UserRole::Editor,
                UserRole::Author,
            ],
            true,
        );
    }
}
