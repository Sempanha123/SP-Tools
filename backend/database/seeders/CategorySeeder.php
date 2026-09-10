<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'World',
                'slug' => 'world',
                'description' =>
                    'International news and major global developments.',
                'icon' => 'globe',
                'color' => 'indigo',
                'sort_order' => 1,
            ],
            [
                'name' => 'Asia',
                'slug' => 'asia',
                'description' =>
                    'News and developments from across Asia.',
                'icon' => 'map',
                'color' => 'red',
                'sort_order' => 2,
            ],
            [
                'name' => 'Americas',
                'slug' => 'americas',
                'description' =>
                    'Coverage from North, Central and South America.',
                'icon' => 'map',
                'color' => 'blue',
                'sort_order' => 3,
            ],
            [
                'name' => 'Europe',
                'slug' => 'europe',
                'description' =>
                    'Political, economic and social developments in Europe.',
                'icon' => 'landmark',
                'color' => 'violet',
                'sort_order' => 4,
            ],
            [
                'name' => 'Middle East',
                'slug' => 'middle-east',
                'description' =>
                    'Regional news and developments from the Middle East.',
                'icon' => 'map',
                'color' => 'amber',
                'sort_order' => 5,
            ],
            [
                'name' => 'Business',
                'slug' => 'business',
                'description' =>
                    'Business, markets, finance and economic reporting.',
                'icon' => 'briefcase',
                'color' => 'emerald',
                'sort_order' => 6,
            ],
            [
                'name' => 'Technology',
                'slug' => 'technology',
                'description' =>
                    'Technology, artificial intelligence and digital developments.',
                'icon' => 'cpu',
                'color' => 'cyan',
                'sort_order' => 7,
            ],
            [
                'name' => 'Science',
                'slug' => 'science',
                'description' =>
                    'Research, discoveries and scientific developments.',
                'icon' => 'flask',
                'color' => 'purple',
                'sort_order' => 8,
            ],
            [
                'name' => 'Climate',
                'slug' => 'climate',
                'description' =>
                    'Climate, environment and sustainability coverage.',
                'icon' => 'leaf',
                'color' => 'green',
                'sort_order' => 9,
            ],
            [
                'name' => 'Health',
                'slug' => 'health',
                'description' =>
                    'Public health, medicine and healthcare developments.',
                'icon' => 'heart',
                'color' => 'rose',
                'sort_order' => 10,
            ],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                [
                    'slug' => $category['slug'],
                ],
                [
                    ...$category,
                    'is_active' => true,
                ],
            );
        }
    }
}