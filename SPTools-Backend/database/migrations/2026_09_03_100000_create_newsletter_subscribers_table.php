<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('newsletter_subscribers', function (Blueprint $table) {
            $table->id();

            $table->string('email', 191)->unique();

            /*
             * pending  — created, confirmation not yet clicked
             * active   — confirmed, receiving the briefing
             * unsubscribed — opted out, kept so we can honour the opt-out
             */
            $table->string('status', 20)->default('pending');

            /* Where the signup came from: website, footer, article, … */
            $table->string('source', 60)->nullable();

            /* Single-use token for the confirm / unsubscribe links. */
            $table->string('token', 64)->unique()->nullable();

            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('unsubscribed_at')->nullable();

            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent', 255)->nullable();

            $table->timestamps();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('newsletter_subscribers');
    }
};
