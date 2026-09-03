<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table
                ->string('slug', 191)
                ->nullable()
                ->unique()
                ->after('name');
        });

        $users = DB::table('users')
            ->select([
                'id',
                'name',
            ])
            ->orderBy('id')
            ->get();

        foreach ($users as $user) {
            $baseSlug = Str::slug(
                (string) $user->name,
            ) ?: 'author';

            $slug = $baseSlug;
            $suffix = 2;

            while (
                DB::table('users')
                    ->where('slug', $slug)
                    ->exists()
            ) {
                $slug = "{$baseSlug}-{$suffix}";
                $suffix++;
            }

            DB::table('users')
                ->where('id', $user->id)
                ->update([
                    'slug' => $slug,
                ]);
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropUnique([
                'slug',
            ]);

            $table->dropColumn(
                'slug',
            );
        });
    }
};