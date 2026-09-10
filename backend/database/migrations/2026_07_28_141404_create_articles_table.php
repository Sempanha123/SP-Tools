<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();

            /*
            |--------------------------------------------------------------------------
            | Relationships
            |--------------------------------------------------------------------------
            */

            $table
                ->foreignId('author_id')
                ->constrained('users')
                ->restrictOnDelete()
                ->cascadeOnUpdate();

            $table
                ->foreignId('category_id')
                ->constrained('categories')
                ->restrictOnDelete()
                ->cascadeOnUpdate();

            /*
            |--------------------------------------------------------------------------
            | Main article information
            |--------------------------------------------------------------------------
            */

            $table->string('title', 191);
            $table->string('slug', 191)->unique();

            $table->text('excerpt');
            $table->longText('lead')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Cover image
            |--------------------------------------------------------------------------
            */

            $table->string('cover_image', 500)->nullable();
            $table->string('image_caption', 500)->nullable();
            $table->string('image_credit', 191)->nullable();

            /*
            |--------------------------------------------------------------------------
            | Classification
            |--------------------------------------------------------------------------
            */

            $table->string('region', 100)->default('Global');
            $table->string('location', 191)->nullable();
            $table->string('source', 191)->default('SP-Tools News');

            /*
            |--------------------------------------------------------------------------
            | Publishing
            |--------------------------------------------------------------------------
            */

            $table
                ->string('status', 30)
                ->default('draft')
                ->index();

            $table
                ->boolean('is_featured')
                ->default(false);

            $table
                ->boolean('is_breaking')
                ->default(false);

            $table
                ->boolean('is_live')
                ->default(false);

            $table
                ->unsignedSmallInteger('read_time_minutes')
                ->default(1);

            $table
                ->unsignedBigInteger('views')
                ->default(0);

            $table
                ->timestamp('published_at')
                ->nullable();

            $table
                ->timestamp('scheduled_at')
                ->nullable();

            /*
            |--------------------------------------------------------------------------
            | Structured article content
            |--------------------------------------------------------------------------
            */

            $table->json('sections')->nullable();
            $table->json('key_points')->nullable();
            $table->json('timeline')->nullable();
            $table->json('sources')->nullable();

            /*
            |--------------------------------------------------------------------------
            | Editorial transparency
            |--------------------------------------------------------------------------
            */

            $table->text('methodology_note')->nullable();
            $table->text('correction_note')->nullable();

            /*
            |--------------------------------------------------------------------------
            | SEO
            |--------------------------------------------------------------------------
            */

            $table->string('meta_title', 191)->nullable();
            $table->text('meta_description')->nullable();
            $table->string('canonical_url', 500)->nullable();

            $table->timestamps();
            $table->softDeletes();

            /*
            |--------------------------------------------------------------------------
            | Query indexes
            |--------------------------------------------------------------------------
            */

            $table->index([
                'category_id',
                'status',
                'published_at',
            ]);

            $table->index([
                'status',
                'is_featured',
            ]);

            $table->index([
                'status',
                'is_breaking',
            ]);

            $table->index('region');
            $table->index('scheduled_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
