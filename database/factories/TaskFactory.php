<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->sentence(),
            'description' => fake()->realText(),
            'image_path' => fake()->imageUrl(),
            'priority' => fake()->randomElement(['low', 'medium', 'high']),
            'assigned_to' => 1, 
            'status' => fake()->randomElement(['pending', 'completed', 'in_progress']),
            'created_by' => 1, 
            'updated_by' => 1,
            'due_date' => fake()->dateTimeBetween('now', '+1 year'),
            'completed_at' => fake()->optional()->dateTimeBetween('now', '+1 year')
        ];
    }
}
