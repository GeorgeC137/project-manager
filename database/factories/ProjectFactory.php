<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
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
            'status' => fake()->randomElement(['pending', 'completed', 'in_progress']),
            'created_by' => 1, // Assuming user IDs 1, 2, and 3 exist
            'updated_by' => 1,
            'due_date' => fake()->dateTimeBetween('now', '+1 year')
        ];
    }
}
