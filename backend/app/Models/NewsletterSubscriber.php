<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class NewsletterSubscriber extends Model
{
    public const STATUS_PENDING = 'pending';

    public const STATUS_ACTIVE = 'active';

    public const STATUS_UNSUBSCRIBED = 'unsubscribed';

    protected $fillable = [
        'email',
        'status',
        'source',
        'token',
        'confirmed_at',
        'unsubscribed_at',
        'ip_address',
        'user_agent',
    ];

    protected $hidden = [
        'token',
        'ip_address',
        'user_agent',
    ];

    protected function casts(): array
    {
        return [
            'confirmed_at' => 'datetime',
            'unsubscribed_at' => 'datetime',
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    */

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_ACTIVE);
    }

    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeUnsubscribed(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_UNSUBSCRIBED);
    }

    /*
    |--------------------------------------------------------------------------
    | Behaviour
    |--------------------------------------------------------------------------
    */

    public static function freshToken(): string
    {
        return Str::random(64);
    }

    public function isActive(): bool
    {
        return $this->status === self::STATUS_ACTIVE;
    }

    /**
     * Marks the subscriber confirmed. Idempotent, so a double-clicked
     * confirmation link does not move confirmed_at.
     */
    public function confirm(): void
    {
        if ($this->isActive()) {
            return;
        }

        $this->forceFill([
            'status' => self::STATUS_ACTIVE,
            'confirmed_at' => $this->confirmed_at ?? now(),
            'unsubscribed_at' => null,
        ])->save();
    }

    public function unsubscribe(): void
    {
        $this->forceFill([
            'status' => self::STATUS_UNSUBSCRIBED,
            'unsubscribed_at' => now(),
        ])->save();
    }
}
