<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Enums\ArticleStatus;
use DomainException;

class Article extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'author_id',
        'category_id',

        'title',
        'slug',
        'excerpt',
        'lead',

        'cover_image',
        'image_caption',
        'image_credit',

        'region',
        'location',
        'source',

        'status',

        'is_featured',
        'is_breaking',
        'is_live',

        'read_time_minutes',
        'views',

        'published_at',
        'scheduled_at',

        'sections',
        'key_points',
        'timeline',
        'sources',

        'methodology_note',
        'correction_note',

        'meta_title',
        'meta_description',
        'canonical_url',
    ];

    protected $attributes = [
        'status' => 'draft',

        'region' => 'Global',
        'source' => 'SP-Tools News',

        'is_featured' => false,
        'is_breaking' => false,
        'is_live' => false,

        'read_time_minutes' => 1,
        'views' => 0,
    ];

    protected function casts(): array
    {
        return [
            'status' => ArticleStatus::class,

            'is_featured' => 'boolean',
            'is_breaking' => 'boolean',
            'is_live' => 'boolean',

            'read_time_minutes' => 'integer',
            'views' => 'integer',

            'sections' => 'array',
            'key_points' => 'array',
            'timeline' => 'array',
            'sources' => 'array',

            'published_at' => 'datetime',
            'scheduled_at' => 'datetime',
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function author(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'author_id',
        );
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(
            Category::class,
        );
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(
            Tag::class,
        )->withTimestamps();
    }

    /*
    |--------------------------------------------------------------------------
    | Query scopes
    |--------------------------------------------------------------------------
    */

    public function scopePublished(
        Builder $query,
    ): Builder {
        return $query
            ->where(
                'status',
                ArticleStatus::Published->value,
            )
            ->whereNotNull(
                'published_at',
            )
            ->where(
                'published_at',
                '<=',
                now(),
            );
    }

    public function scopeFeatured(
        Builder $query,
    ): Builder {
        return $query->where(
            'is_featured',
            true,
        );
    }

    public function scopeBreaking(
        Builder $query,
    ): Builder {
        return $query->where(
            'is_breaking',
            true,
        );
    }

    public function scopeMostRead(
        Builder $query,
    ): Builder {
        return $query->orderByDesc(
            'views',
        );
    }

    public function scopeDraft(
        Builder $query,
    ): Builder {
        return $query->where(
            'status',
            ArticleStatus::Draft->value,
        );
    }

    public function scopeReviewing(
        Builder $query,
    ): Builder {
        return $query->where(
            'status',
            ArticleStatus::Reviewing->value,
        );
    }

    public function scopeScheduled(
        Builder $query,
    ): Builder {
        return $query
            ->where(
                'status',
                ArticleStatus::Scheduled->value,
            )
            ->whereNotNull('scheduled_at');
    }

    public function scopeArchived(
        Builder $query,
    ): Builder {
        return $query->where(
            'status',
            ArticleStatus::Archived->value,
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Status helpers
    |--------------------------------------------------------------------------
    */

    public function isDraft(): bool
    {
        return $this->status === ArticleStatus::Draft;
    }

    public function isReviewing(): bool
    {
        return $this->status === ArticleStatus::Reviewing;
    }

    public function isScheduled(): bool
    {
        return $this->status === ArticleStatus::Scheduled;
    }

    public function isPublished(): bool
    {
        return $this->status === ArticleStatus::Published;
    }

    public function isArchived(): bool
    {
        return $this->status === ArticleStatus::Archived;
    }

    public function isPubliclyVisible(): bool
    {
        return $this->status === ArticleStatus::Published
            && $this->published_at !== null
            && $this->published_at->isPast();
    }


    /*
|--------------------------------------------------------------------------
| Change article status
|--------------------------------------------------------------------------
*/

    public function transitionTo(
        ArticleStatus $newStatus,
    ): void {
        $currentStatus = $this->status;

        if ($currentStatus === null) {
            $currentStatus = ArticleStatus::Draft;
        }

        if (!$currentStatus instanceof ArticleStatus) {
            throw new DomainException(
                'The article has an invalid current status.',
            );
        }

        if (
            !$currentStatus->canTransitionTo(
                $newStatus,
            )
        ) {
            throw new DomainException(
                sprintf(
                    'Article cannot transition from %s to %s.',
                    $currentStatus->value,
                    $newStatus->value,
                ),
            );
        }

        $this->status = $newStatus;

        match ($newStatus) {
            ArticleStatus::Draft =>
            $this->prepareAsDraft(),

            ArticleStatus::Reviewing =>
            $this->prepareForReview(),

            ArticleStatus::Scheduled =>
            $this->prepareAsScheduled(),

            ArticleStatus::Published =>
            $this->prepareAsPublished(),

            ArticleStatus::Archived =>
            $this->prepareAsArchived(),
        };

        $this->save();
    }

    private function prepareAsDraft(): void
    {
        $this->published_at = null;
        $this->scheduled_at = null;
        $this->is_live = false;
    }

    private function prepareForReview(): void
    {
        $this->published_at = null;
        $this->scheduled_at = null;

        $this->is_live = false;
    }

    private function prepareAsScheduled(): void
    {
        if ($this->scheduled_at === null) {
            throw new DomainException(
                'A scheduled article requires a publication date.',
            );
        }

        if ($this->scheduled_at->lessThanOrEqualTo(now())) {
            throw new DomainException(
                'The scheduled publication date must be in the future.',
            );
        }

        $this->published_at = null;

        $this->is_live = false;
    }

    private function prepareAsPublished(): void
    {
        $this->published_at ??= now();
        $this->scheduled_at = null;
    }

    private function prepareAsArchived(): void
    {
        $this->scheduled_at = null;
        $this->is_breaking = false;
        $this->is_live = false;
    }
}
