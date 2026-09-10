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

class CategoryExpansionSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function (): void {
            $categories = Category::query()
                ->whereIn('slug', [
                    'business',
                    'technology',
                    'science',
                    'climate',
                    'health',
                ])
                ->get()
                ->keyBy('slug');

            $tags = Tag::query()
                ->get()
                ->keyBy('slug');

            $authors = User::query()
                ->whereIn('email', [
                    'maya.chen@sptools.local',
                    'noah.laurent@sptools.local',
                    'amira.rahman@sptools.local',
                    'leo.martinez@sptools.local',
                ])
                ->get()
                ->keyBy('email');

            if ($categories->count() < 5) {
                throw new RuntimeException(
                    'Missing News categories. Run CategorySeeder first.'
                );
            }

            if ($authors->isEmpty()) {
                throw new RuntimeException(
                    'Missing demo authors. Run DemoNewsSeeder first.'
                );
            }

            foreach ($this->stories() as $story) {
                $category = $categories->get($story['category']);
                $author = $authors->get($story['author']);

                if (! $category || ! $author) {
                    throw new RuntimeException(
                        "Missing category or author for {$story['slug']}."
                    );
                }

                $article = Article::updateOrCreate(
                    ['slug' => $story['slug']],
                    [
                        'author_id' => $author->id,
                        'category_id' => $category->id,
                        'title' => $story['title'],
                        'excerpt' => $story['excerpt'],
                        'lead' => $story['lead'] ?? $story['excerpt'],
                        'cover_image' =>
                            "https://picsum.photos/seed/{$story['slug']}/1400/900",
                        'image_caption' =>
                            'Fictional demo image for the SP-Tools News interface.',
                        'image_credit' =>
                            'Picsum demo image',
                        'region' => $story['region'],
                        'location' => $story['location'],
                        'source' => 'SP-Tools Demo Desk',
                        'status' => ArticleStatus::Published,
                        'is_featured' => $story['featured'] ?? false,
                        'is_breaking' => $story['breaking'] ?? false,
                        'is_live' => false,
                        'read_time_minutes' => $story['read_time'] ?? 5,
                        'views' => $story['views'],
                        'published_at' =>
                            now()->subHours($story['hours_ago']),
                        'scheduled_at' => null,
                        'key_points' => [
                            'Fictional demonstration content for SP-Tools News UI development.',
                            "This story belongs to the {$category->name} category archive.",
                            'Replace demo reporting with verified reporting before public editorial use.',
                        ],
                        'sections' => [
                            [
                                'id' => 'overview',
                                'title' => 'What this demo story is testing',
                                'paragraphs' => [
                                    $story['excerpt'],
                                    'This sample article exists to test category archives, long-form reading hierarchy and responsive article layouts.',
                                ],
                                'bullets' => [
                                    "Region: {$story['region']}",
                                    "Location: {$story['location']}",
                                    'Fixture source: SP-Tools Demo Desk',
                                ],
                                'image' =>
                                    "https://picsum.photos/seed/{$story['slug']}-section/1200/760",
                                'imageAlt' =>
                                    'Fictional editorial demo image.',
                                'imageCaption' =>
                                    'Demo section image used to test the article reader.',
                                'imageCredit' =>
                                    'Picsum demo image',
                                'imagePosition' => 'after',
                            ],
                            [
                                'id' => 'context',
                                'title' => 'Context and signals',
                                'paragraphs' => [
                                    'The fixture is intentionally structured so category pages contain enough real-looking data to test lead stories, card grids, filters and recommendation rails.',
                                ],
                            ],
                            [
                                'id' => 'next',
                                'title' => 'What comes next',
                                'paragraphs' => [
                                    'When the newsroom is connected to verified reporting, this fixture can be replaced without changing the frontend layout.',
                                ],
                            ],
                        ],
                        'timeline' => [],
                        'sources' => [
                            [
                                'name' =>
                                    'SP-Tools demo fixture',
                                'type' =>
                                    'Demonstration data',
                                'description' =>
                                    'Synthetic content for local UI development.',
                                'url' => null,
                            ],
                        ],
                        'methodology_note' =>
                            'Synthetic local-development fixture. Do not publish as real reporting.',
                        'correction_note' => null,
                        'meta_title' => $story['title'],
                        'meta_description' => $story['excerpt'],
                        'canonical_url' => null,
                    ],
                );

                $tagIds = collect($story['tags'])
                    ->map(
                        fn (string $slug) =>
                            $tags->get($slug)?->id
                    )
                    ->filter()
                    ->values();

                $article->tags()->sync($tagIds);
            }
        });
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function stories(): array
    {
        return [
            [
                'slug' => 'regional-retailers-test-shared-demand-signals',
                'title' => 'Regional retailers test shared demand signals to reduce empty shelves',
                'excerpt' => 'A fictional business report on stores sharing limited inventory signals with suppliers while keeping customer-level data separate.',
                'category' => 'business',
                'region' => 'Asia',
                'location' => 'Singapore',
                'author' => 'leo.martinez@sptools.local',
                'tags' => ['business', 'markets', 'technology'],
                'hours_ago' => 8,
                'views' => 28400,
                'featured' => true,
                'read_time' => 6,
            ],
            [
                'slug' => 'small-exporters-pilot-faster-digital-trade-documents',
                'title' => 'Small exporters pilot faster digital trade documents across regional hubs',
                'excerpt' => 'A demo business story about simplifying document handoffs for smaller companies moving goods between markets.',
                'category' => 'business',
                'region' => 'Global',
                'location' => 'Rotterdam',
                'author' => 'leo.martinez@sptools.local',
                'tags' => ['business', 'trade', 'global'],
                'hours_ago' => 26,
                'views' => 19300,
                'read_time' => 5,
            ],
            [
                'slug' => 'payment-networks-test-clearer-small-business-settlement',
                'title' => 'Payment networks test clearer settlement windows for small businesses',
                'excerpt' => 'A fictional markets fixture on faster reconciliation and simpler transaction status information for merchants.',
                'category' => 'business',
                'region' => 'Americas',
                'location' => 'Toronto',
                'author' => 'maya.chen@sptools.local',
                'tags' => ['business', 'markets', 'technology'],
                'hours_ago' => 38,
                'views' => 17100,
                'read_time' => 5,
            ],

            [
                'slug' => 'browser-teams-test-private-on-device-ai-assistants',
                'title' => 'Browser teams test private on-device AI assistants for everyday tasks',
                'excerpt' => 'A fictional technology story on smaller local models handling summaries and simple workflows without sending every request to the cloud.',
                'category' => 'technology',
                'region' => 'Global',
                'location' => 'San Francisco',
                'author' => 'maya.chen@sptools.local',
                'tags' => ['technology', 'ai', 'science'],
                'hours_ago' => 6,
                'views' => 61200,
                'featured' => true,
                'read_time' => 7,
            ],
            [
                'slug' => 'cities-publish-common-open-data-interfaces',
                'title' => 'Cities publish common open-data interfaces for transport and public services',
                'excerpt' => 'A demo technology fixture exploring compatible APIs for maps, transport updates and public-service information.',
                'category' => 'technology',
                'region' => 'Europe',
                'location' => 'Berlin',
                'author' => 'maya.chen@sptools.local',
                'tags' => ['technology', 'policy', 'europe'],
                'hours_ago' => 28,
                'views' => 24700,
                'read_time' => 5,
            ],
            [
                'slug' => 'data-centers-test-flexible-compute-scheduling',
                'title' => 'Data centers test flexible compute scheduling around cleaner power windows',
                'excerpt' => 'A fictional technology report on shifting non-urgent workloads toward periods with more available low-carbon electricity.',
                'category' => 'technology',
                'region' => 'Europe',
                'location' => 'Helsinki',
                'author' => 'noah.laurent@sptools.local',
                'tags' => ['technology', 'energy', 'climate'],
                'hours_ago' => 42,
                'views' => 22200,
                'read_time' => 6,
            ],

            [
                'slug' => 'ocean-labs-coordinate-open-sensor-calibration',
                'title' => 'Ocean labs coordinate open sensor calibration for long-term coastal research',
                'excerpt' => 'A fictional science report on research teams comparing instruments so measurements remain useful across different sites and years.',
                'category' => 'science',
                'region' => 'Global',
                'location' => 'Lisbon',
                'author' => 'amira.rahman@sptools.local',
                'tags' => ['science', 'climate', 'global'],
                'hours_ago' => 10,
                'views' => 26800,
                'featured' => true,
                'read_time' => 7,
            ],
            [
                'slug' => 'materials-labs-share-fast-battery-screening-protocol',
                'title' => 'Materials labs share faster battery screening protocol for early experiments',
                'excerpt' => 'A demo science fixture about laboratories publishing comparable early-stage battery test procedures.',
                'category' => 'science',
                'region' => 'Asia',
                'location' => 'Seoul',
                'author' => 'amira.rahman@sptools.local',
                'tags' => ['science', 'energy', 'technology'],
                'hours_ago' => 31,
                'views' => 20100,
                'read_time' => 6,
            ],
            [
                'slug' => 'satellite-teams-open-new-earth-observation-benchmark',
                'title' => 'Satellite teams open new benchmark for comparing Earth-observation models',
                'excerpt' => 'A fictional research fixture on common evaluation sets for models that classify land, water and weather patterns.',
                'category' => 'science',
                'region' => 'Global',
                'location' => 'Geneva',
                'author' => 'maya.chen@sptools.local',
                'tags' => ['science', 'technology', 'climate'],
                'hours_ago' => 46,
                'views' => 18500,
                'read_time' => 6,
            ],

            [
                'slug' => 'cities-map-connected-cooling-routes-before-hot-season',
                'title' => 'Cities map connected cooling routes before the next hot season',
                'excerpt' => 'A fictional climate story on linking shade, drinking water, transit and cooling spaces into clearer walking routes.',
                'category' => 'climate',
                'region' => 'Asia',
                'location' => 'Bangkok',
                'author' => 'noah.laurent@sptools.local',
                'tags' => ['climate', 'asia', 'policy'],
                'hours_ago' => 12,
                'views' => 33900,
                'featured' => true,
                'read_time' => 6,
            ],
            [
                'slug' => 'power-grids-test-day-ahead-clean-energy-signals',
                'title' => 'Power grids test clearer day-ahead clean-energy signals for large users',
                'excerpt' => 'A demo climate and energy fixture about giving flexible electricity users better information about cleaner supply windows.',
                'category' => 'climate',
                'region' => 'Europe',
                'location' => 'Copenhagen',
                'author' => 'noah.laurent@sptools.local',
                'tags' => ['climate', 'energy', 'technology'],
                'hours_ago' => 34,
                'views' => 22900,
                'read_time' => 5,
            ],
            [
                'slug' => 'ports-test-climate-risk-maintenance-dashboard',
                'title' => 'Ports test shared climate-risk maintenance dashboard for critical equipment',
                'excerpt' => 'A fictional climate fixture on combining heat, flooding and maintenance records for more resilient port operations.',
                'category' => 'climate',
                'region' => 'Global',
                'location' => 'Rotterdam',
                'author' => 'leo.martinez@sptools.local',
                'tags' => ['climate', 'trade', 'global'],
                'hours_ago' => 49,
                'views' => 17600,
                'read_time' => 6,
            ],

            [
                'slug' => 'clinics-test-simpler-multilingual-follow-up-guides',
                'title' => 'Clinics test simpler multilingual follow-up guides after routine visits',
                'excerpt' => 'A fictional health report on shorter instructions, clearer reminders and easier ways for patients to ask follow-up questions.',
                'category' => 'health',
                'region' => 'Asia',
                'location' => 'Kuala Lumpur',
                'author' => 'amira.rahman@sptools.local',
                'tags' => ['health', 'asia', 'technology'],
                'hours_ago' => 9,
                'views' => 31200,
                'featured' => true,
                'read_time' => 6,
            ],
            [
                'slug' => 'hospitals-publish-common-wait-time-definitions',
                'title' => 'Hospitals publish common wait-time definitions for clearer patient updates',
                'excerpt' => 'A demo health fixture on standardizing how appointment and service delays are explained across hospital systems.',
                'category' => 'health',
                'region' => 'Europe',
                'location' => 'Paris',
                'author' => 'amira.rahman@sptools.local',
                'tags' => ['health', 'policy', 'europe'],
                'hours_ago' => 29,
                'views' => 21800,
                'read_time' => 5,
            ],
            [
                'slug' => 'health-agencies-test-privacy-first-local-alerts',
                'title' => 'Health agencies test privacy-first local alerts for seasonal service pressure',
                'excerpt' => 'A fictional public-health fixture on notifying communities about service demand without exposing individual patient data.',
                'category' => 'health',
                'region' => 'Americas',
                'location' => 'Toronto',
                'author' => 'amira.rahman@sptools.local',
                'tags' => ['health', 'policy', 'technology'],
                'hours_ago' => 44,
                'views' => 18700,
                'read_time' => 5,
            ],
        ];
    }
}
