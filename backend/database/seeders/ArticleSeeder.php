<?php

namespace Database\Seeders;

use App\Enums\ArticleStatus;
use App\Models\Article;
use App\Models\Category;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function (): void {
            $author = User::query()
                ->where('email', config('news.admin.email'))
                ->first();

            if (!$author) {
                throw new RuntimeException(
                    'Admin user was not found. Run AdminUserSeeder first.',
                );
            }

            $category = Category::query()
                ->where('slug', 'asia')
                ->first();

            if (!$category) {
                throw new RuntimeException(
                    'Asia category was not found. Run CategorySeeder first.',
                );
            }

            $article = Article::updateOrCreate(
                [
                    'slug' =>
                        'regional-leaders-prepare-for-summit',
                ],
                [
                    'author_id' =>
                        $author->id,

                    'category_id' =>
                        $category->id,

                    'title' =>
                        'Regional leaders prepare for upcoming international summit',

                    'excerpt' =>
                        'Officials are preparing for discussions focused on regional cooperation, trade and security.',

                    'lead' =>
                        'Regional leaders are preparing for an international summit expected to focus on cooperation, trade, security and future regional priorities.',

                    'cover_image' => null,

                    'image_caption' =>
                        'A demonstration cover image used for the sample news article.',

                    'image_credit' =>
                        'Demo image',

                    'region' =>
                        'Asia',

                    'location' =>
                        'Singapore',

                    'source' =>
                        'SP-Tools News',

                    'status' =>
                        ArticleStatus::Published,

                    'is_featured' =>
                        true,

                    'is_breaking' =>
                        false,

                    'is_live' =>
                        false,

                    'read_time_minutes' =>
                        5,

                    'views' =>
                        12800,

                    'published_at' =>
                        now()->subHours(2),

                    'scheduled_at' =>
                        null,

                    'key_points' => [
                        'Regional representatives are expected to attend.',
                        'Trade and regional security are expected to be major discussion areas.',
                        'Several bilateral meetings may take place around the summit.',
                        'Additional announcements are expected after official meetings conclude.',
                    ],

                    'sections' => [
                        [
                            'id' =>
                                'what-we-know',

                            'title' =>
                                'What we know',

                            'paragraphs' => [
                                'This demonstration section shows where verified reporting about the summit should be displayed.',
                                'Replace this text with confirmed information from named and reliable sources before publishing the article as real news.',
                            ],

                            'bullets' => [
                                'Confirm the summit date and official location.',
                                'Identify participating leaders using official announcements.',
                                'Add direct links to primary sources.',
                            ],
                        ],
                        [
                            'id' =>
                                'why-this-story-matters',

                            'title' =>
                                'Why this story matters',

                            'paragraphs' => [
                                'This section should explain the regional significance of the event and how its decisions could affect countries, organizations or communities.',
                            ],

                            'quote' =>
                                'Clear reporting should separate verified facts, analysis and information that remains uncertain.',

                            'quoteAttribution' =>
                                'SP-Tools News editorial standard',
                        ],
                        [
                            'id' =>
                                'what-happens-next',

                            'title' =>
                                'What happens next',

                            'paragraphs' => [
                                'Add expected official meetings, announcements and follow-up events after their details have been confirmed.',
                            ],
                        ],
                    ],

                    'timeline' => [
                        [
                            'time' =>
                                '8:30 AM',

                            'title' =>
                                'Initial schedule prepared',

                            'description' =>
                                'This is demonstration timeline content for testing the article interface.',
                        ],
                        [
                            'time' =>
                                '12:15 PM',

                            'title' =>
                                'Delegation preparations continue',

                            'description' =>
                                'Replace this entry with confirmed information before publication.',
                        ],
                    ],

                    'sources' => [
                        [
                            'name' =>
                                'Official summit announcement',

                            'type' =>
                                'Primary source',

                            'description' =>
                                'Replace this demonstration source with the official event announcement.',

                            'url' =>
                                null,
                        ],
                    ],

                    'methodology_note' =>
                        'This is demonstration content created to test the SP-Tools News publishing system.',

                    'correction_note' =>
                        'No corrections have been issued.',

                    'meta_title' =>
                        'Regional Leaders Prepare for International Summit',

                    'meta_description' =>
                        'Follow updates related to preparations for an upcoming international summit.',

                    'canonical_url' =>
                        null,
                ],
            );

            $tagIds = Tag::query()
                ->whereIn(
                    'slug',
                    [
                        'diplomacy',
                        'asia',
                        'global',
                        'policy',
                    ],
                )
                ->pluck('id');

            $article
                ->tags()
                ->sync($tagIds);
        });
    }
}