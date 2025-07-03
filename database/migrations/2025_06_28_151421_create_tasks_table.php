<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->longText('description')->nullable();
            $table->string('image_path')->nullable();
            $table->string('priority');
            $table->string('status');
            $table->foreignId('assigned_to')
                ->constrained('users')
                ->onDelete('cascade'); // Assuming 'users' table exists and has a primary key
            $table->foreignId('project_id')
                ->constrained('projects')
                ->onDelete('cascade'); // Assuming 'projects' table exists and has a primary key
            $table->foreignId('created_by')
                ->constrained('users')
                ->onDelete('cascade'); 
            $table->foreignId('updated_by')
                ->constrained('users')
                ->onDelete('cascade');
            $table->timestamp('due_date')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
