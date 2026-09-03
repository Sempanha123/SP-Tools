<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contact_messages', function (Blueprint $table) {
            $table->id();

            $table->string('name', 120);
            $table->string('email', 191);
            $table->string('subject', 191);
            $table->text('message');

            /* new — unread, read — seen, resolved — actioned, spam */
            $table->string('status', 20)->default('new');

            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent', 255)->nullable();

            $table->timestamp('read_at')->nullable();
            $table->timestamp('resolved_at')->nullable();

            $table->timestamps();

            $table->index('status');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contact_messages');
    }
};
