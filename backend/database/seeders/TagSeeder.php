<?php

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    public function run(): void
    {
        $tags = [
            'AI',
            'Asia',
            'Business',
            'Climate',
            'Diplomacy',
            'Economy',
            'Energy',
            'Europe',
            'Global',
            'Health',
            'Markets',
            'Policy',
            'Science',
            'Security',
            'Technology',
            'Trade',
            'World',
        ];

        foreach ($tags as $tagName) {
            Tag::updateOrCreate(
                [
                    'slug' => str($tagName)
                        ->slug()
                        ->toString(),
                ],
                [
                    'name' => $tagName,

                    'description' =>
                        "News and reports related to {$tagName}.",
                ],
            );
        }
    }
}