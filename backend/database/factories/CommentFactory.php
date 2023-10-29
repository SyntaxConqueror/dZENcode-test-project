<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Storage;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Comment>
 */
class CommentFactory extends Factory
{
    public $file_url;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => $this->user_id ?? 0,
            'text_content' => fake()->text(350),
            'parent_id' => $this->faker->optional(0.5)->numberBetween(0, 50),
            'file_url' => $this->file_url,
        ];
    }
}
