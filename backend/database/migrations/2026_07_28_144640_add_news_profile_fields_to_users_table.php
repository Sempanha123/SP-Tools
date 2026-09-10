<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table
                ->string('role', 30)
                ->default('author')
                ->index()
                ->after('password');

            $table
                ->string('avatar', 500)
                ->nullable()
                ->after('role');

            $table
                ->text('bio')
                ->nullable()
                ->after('avatar');

            $table
                ->string('location', 191)
                ->nullable()
                ->after('bio');

            $table
                ->boolean('is_active')
                ->default(true)
                ->index()
                ->after('location');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex([
                'role',
            ]);

            $table->dropIndex([
                'is_active',
            ]);

            $table->dropColumn([
                'role',
                'avatar',
                'bio',
                'location',
                'is_active',
            ]);
        });
    }
};