<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    public const STATUS_NEW = 'new';

    public const STATUS_READ = 'read';

    public const STATUS_RESOLVED = 'resolved';

    public const STATUS_SPAM = 'spam';

    protected $fillable = [
        'name',
        'email',
        'subject',
        'message',
        'status',
        'ip_address',
        'user_agent',
        'read_at',
        'resolved_at',
    ];

    protected $hidden = [
        'ip_address',
        'user_agent',
    ];

    protected function casts(): array
    {
        return [
            'read_at' => 'datetime',
            'resolved_at' => 'datetime',
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    */

    public function scopeUnread(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_NEW);
    }

    public function scopeResolved(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_RESOLVED);
    }

    /*
    |--------------------------------------------------------------------------
    | Behaviour
    |--------------------------------------------------------------------------
    */

    public function markRead(): void
    {
        if ($this->status !== self::STATUS_NEW) {
            return;
        }

        $this->forceFill([
            'status' => self::STATUS_READ,
            'read_at' => now(),
        ])->save();
    }

    public function markResolved(): void
    {
        $this->forceFill([
            'status' => self::STATUS_RESOLVED,
            'read_at' => $this->read_at ?? now(),
            'resolved_at' => now(),
        ])->save();
    }
}
