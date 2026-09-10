<?php

namespace Database\Seeders;

use App\Enums\ArticleStatus;
use App\Enums\UserRole;
use App\Models\Article;
use App\Models\Category;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use RuntimeException;

class DemoNewsSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function (): void {
            $authors = $this->seedAuthors();
            $categories = Category::query()->get()->keyBy('slug');
            $tags = Tag::query()->get()->keyBy('slug');

            if ($categories->isEmpty() || $tags->isEmpty()) {
                throw new RuntimeException('Run CategorySeeder and TagSeeder before DemoNewsSeeder.');
            }

            foreach ($this->stories() as $index => $story) {
                $category = $categories->get($story['category']);
                $author = $authors[$story['author']] ?? null;

                if (! $category || ! $author) {
                    throw new RuntimeException("Demo fixture is missing a category or author for {$story['slug']}.");
                }

                $article = Article::updateOrCreate(
                    ['slug' => $story['slug']],
                    [
                        'author_id' => $author->id,
                        'category_id' => $category->id,
                        'title' => $story['title'],
                        'excerpt' => $story['excerpt'],
                        'lead' => $story['lead'] ?? $story['excerpt'],
                        'cover_image' => "https://picsum.photos/seed/{$story['slug']}/1400/900",
                        'image_caption' => 'Demo editorial image for the SP-Tools News interface.',
                        'image_credit' => 'Picsum demo image',
                        'region' => $story['region'],
                        'location' => $story['location'],
                        'source' => 'SP-Tools Demo Desk',
                        'status' => ArticleStatus::Published,
                        'is_featured' => $story['featured'] ?? false,
                        'is_breaking' => $story['breaking'] ?? false,
                        'is_live' => $story['live'] ?? false,
                        'read_time_minutes' => $story['read_time'] ?? 5,
                        'views' => $story['views'],
                        'published_at' => now()->subHours($story['hours_ago']),
                        'scheduled_at' => null,
                        'key_points' => [
                            'This is fictional demonstration content created to exercise the SP-Tools News layouts.',
                            "The fixture belongs to the {$category->name} desk and is tagged for realistic filtering.",
                            'Replace demo reporting with verified, sourced reporting before any public editorial use.',
                        ],
                        'sections' => $this->sectionsFor($story),
                        'timeline' => ($story['breaking'] ?? false) || ($story['live'] ?? false)
                            ? [
                                [
                                    'time' => now()->subHours($story['hours_ago'])->format('g:i A'),
                                    'title' => 'Demo desk opened coverage',
                                    'description' => 'A sample timeline entry used to test breaking and live-story presentation.',
                                ],
                                [
                                    'time' => now()->subHours(max(0, $story['hours_ago'] - 1))->format('g:i A'),
                                    'title' => 'Demo update added',
                                    'description' => 'A second fixture entry used to verify timeline spacing and hierarchy.',
                                ],
                            ]
                            : [],
                        'sources' => [
                            [
                                'name' => 'SP-Tools demo fixture',
                                'type' => 'Demonstration data',
                                'description' => 'Synthetic content for local UI development. It is not a real news source.',
                                'url' => null,
                            ],
                        ],
                        'methodology_note' => 'Synthetic local-development fixture. Do not publish as real reporting.',
                        'correction_note' => null,
                        'meta_title' => $story['title'],
                        'meta_description' => $story['excerpt'],
                        'canonical_url' => null,
                    ],
                );

                $tagIds = collect($story['tags'])
                    ->map(fn (string $slug) => $tags->get($slug)?->id)
                    ->filter()
                    ->values();

                $article->tags()->sync($tagIds);
            }
        });
    }

    /** @return array<string, User> */
    private function seedAuthors(): array
    {
        $fixtures = [
            'maya' => [
                'name' => 'Maya Chen',
                'slug' => 'maya-chen',
                'email' => 'maya.chen@sptools.local',
                'role' => UserRole::Editor,
                'bio' => 'Demo technology and business editor used to test SP-Tools author pages.',
                'location' => 'Singapore',
            ],
            'noah' => [
                'name' => 'Noah Laurent',
                'slug' => 'noah-laurent',
                'email' => 'noah.laurent@sptools.local',
                'role' => UserRole::Author,
                'bio' => 'Demo correspondent covering cities, climate and regional infrastructure.',
                'location' => 'Paris',
            ],
            'amira' => [
                'name' => 'Amira Rahman',
                'slug' => 'amira-rahman',
                'email' => 'amira.rahman@sptools.local',
                'role' => UserRole::Author,
                'bio' => 'Demo reporter for health, science and public-interest technology coverage.',
                'location' => 'Kuala Lumpur',
            ],
            'leo' => [
                'name' => 'Leo Martinez',
                'slug' => 'leo-martinez',
                'email' => 'leo.martinez@sptools.local',
                'role' => UserRole::Author,
                'bio' => 'Demo reporter following business, logistics and digital infrastructure.',
                'location' => 'Mexico City',
            ],
        ];

        $authors = [];
        foreach ($fixtures as $key => $fixture) {
            $authors[$key] = User::updateOrCreate(
                ['email' => $fixture['email']],
                [
                    'name' => $fixture['name'],
                    'slug' => $fixture['slug'],
                    'password' => Str::random(48),
                    'role' => $fixture['role'],
                    'avatar' => null,
                    'bio' => $fixture['bio'],
                    'location' => $fixture['location'],
                    'is_active' => true,
                    'is_verified' => true,
                ],
            );
        }

        return $authors;
    }

    /** @return array<int, array<string, mixed>> */
    private function sectionsFor(array $story): array
    {
        return [
            [
                'id' => 'overview',
                'title' => 'What the demo story is testing',
                'paragraphs' => [
                    $story['excerpt'],
                    'This paragraph is synthetic fixture copy designed to exercise long-form typography, spacing, article metadata and responsive reading layouts.',
                ],
                'bullets' => [
                    "Region: {$story['region']}",
                    "Location: {$story['location']}",
                    'Fixture source: SP-Tools Demo Desk',
                ],
            ],
            [
                'id' => 'context',
                'title' => 'Context and signals',
                'paragraphs' => [
                    'Use this section to verify that article detail pages can mix narrative paragraphs with structured key points, tags and source transparency.',
                ],
                'quote' => 'Demo content should look realistic enough to test design without being mistaken for verified reporting.',
                'quoteAttribution' => 'SP-Tools development fixture',
            ],
            [
                'id' => 'next',
                'title' => 'What comes next',
                'paragraphs' => [
                    'When the real newsroom is connected, replace these fixtures with verified articles created through the publishing workflow.',
                ],
            ],
        ];
    }

    /** @return array<int, array<string, mixed>> */
    private function stories(): array
    {
        return [
            [
                'slug' => 'global-ports-test-shared-digital-customs-lanes',
                'title' => 'Global ports test shared digital customs lanes for faster cargo handoffs',
                'excerpt' => 'A fictional demo report on ports testing common data formats to reduce delays between shipping, customs and warehouse teams.',
                'category' => 'world', 'region' => 'Global', 'location' => 'Rotterdam', 'author' => 'leo',
                'tags' => ['global', 'trade', 'technology'], 'hours_ago' => 1, 'views' => 42800, 'featured' => true, 'breaking' => true, 'live' => true, 'read_time' => 7,
            ],
            [
                'slug' => 'asia-rail-operators-test-heat-monitoring-network',
                'title' => 'Asian rail operators test shared heat-monitoring network across major stations',
                'excerpt' => 'A demo story exploring how transport operators could use common heat and crowd signals during periods of extreme weather.',
                'category' => 'asia', 'region' => 'Asia', 'location' => 'Bangkok', 'author' => 'noah',
                'tags' => ['asia', 'climate', 'technology'], 'hours_ago' => 3, 'views' => 36100, 'featured' => true, 'breaking' => true, 'read_time' => 6,
            ],
            [
                'slug' => 'americas-cities-publish-open-transit-accessibility-maps',
                'title' => 'Cities across the Americas publish open transit accessibility maps',
                'excerpt' => 'A fictional local-development article about shared accessibility data for buses, trains and public spaces.',
                'category' => 'americas', 'region' => 'Americas', 'location' => 'Toronto', 'author' => 'amira',
                'tags' => ['policy', 'technology', 'global'], 'hours_ago' => 5, 'views' => 29400, 'featured' => true, 'read_time' => 5,
            ],
            [
                'slug' => 'europe-universities-expand-shared-research-compute-network',
                'title' => 'European universities expand a shared research-compute network',
                'excerpt' => 'A demo report on institutions pooling compute capacity for climate, health and materials research.',
                'category' => 'europe', 'region' => 'Europe', 'location' => 'Berlin', 'author' => 'maya',
                'tags' => ['europe', 'science', 'technology'], 'hours_ago' => 7, 'views' => 25300, 'featured' => true, 'read_time' => 6,
            ],
            [
                'slug' => 'middle-east-water-utilities-pilot-smart-leak-mapping',
                'title' => 'Water utilities pilot smart leak mapping across fast-growing districts',
                'excerpt' => 'A fictional regional fixture on sensor networks that help maintenance teams prioritize water-system repairs.',
                'category' => 'middle-east', 'region' => 'Middle East', 'location' => 'Amman', 'author' => 'noah',
                'tags' => ['technology', 'climate', 'policy'], 'hours_ago' => 9, 'views' => 21900, 'featured' => true, 'read_time' => 5,
            ],
            [
                'slug' => 'retailers-trial-same-day-inventory-exchange',
                'title' => 'Retailers trial same-day inventory exchange between neighborhood stores',
                'excerpt' => 'A demo business article about inventory-sharing systems designed to reduce stockouts and unnecessary delivery trips.',
                'category' => 'business', 'region' => 'Global', 'location' => 'London', 'author' => 'leo',
                'tags' => ['business', 'markets', 'technology'], 'hours_ago' => 11, 'views' => 31800, 'breaking' => true, 'read_time' => 5,
            ],
            [
                'slug' => 'open-source-teams-benchmark-efficient-ai-models',
                'title' => 'Open-source teams benchmark smaller AI models for everyday devices',
                'excerpt' => 'A fictional technology fixture comparing latency, memory use and energy demand for compact local AI systems.',
                'category' => 'technology', 'region' => 'Global', 'location' => 'San Francisco', 'author' => 'maya',
                'tags' => ['ai', 'technology', 'science'], 'hours_ago' => 13, 'views' => 58700, 'featured' => true, 'read_time' => 8,
            ],
            [
                'slug' => 'observatories-coordinate-citizen-sky-survey',
                'title' => 'Observatories coordinate a citizen sky survey for short-lived night events',
                'excerpt' => 'A demo science story about researchers combining professional observations with public telescope data.',
                'category' => 'science', 'region' => 'Global', 'location' => 'Atacama', 'author' => 'amira',
                'tags' => ['science', 'global', 'technology'], 'hours_ago' => 15, 'views' => 18400, 'read_time' => 6,
            ],
            [
                'slug' => 'coastal-districts-expand-urban-shade-corridors',
                'title' => 'Coastal districts expand connected urban shade corridors ahead of hotter seasons',
                'excerpt' => 'A fictional climate fixture about public-space design, trees and reflective materials along heavily used walking routes.',
                'category' => 'climate', 'region' => 'Asia', 'location' => 'Singapore', 'author' => 'noah',
                'tags' => ['climate', 'asia', 'policy'], 'hours_ago' => 18, 'views' => 27100, 'read_time' => 6,
            ],
            [
                'slug' => 'hospitals-test-multilingual-appointment-reminders',
                'title' => 'Hospitals test multilingual appointment reminders with simpler follow-up flows',
                'excerpt' => 'A demo health story about reducing missed appointments while keeping patient communications easy to understand.',
                'category' => 'health', 'region' => 'Asia', 'location' => 'Kuala Lumpur', 'author' => 'amira',
                'tags' => ['health', 'technology', 'policy'], 'hours_ago' => 20, 'views' => 23600, 'read_time' => 5,
            ],
            [
                'slug' => 'food-logistics-network-studies-cold-chain-data',
                'title' => 'Food logistics network studies shared cold-chain data for smaller suppliers',
                'excerpt' => 'A fictional global desk report on temperature tracking and handoff visibility across distributed food supply chains.',
                'category' => 'world', 'region' => 'Global', 'location' => 'Singapore', 'author' => 'leo',
                'tags' => ['global', 'trade', 'business'], 'hours_ago' => 23, 'views' => 19600, 'read_time' => 5,
            ],
            [
                'slug' => 'asia-university-consortium-launches-robotics-challenge',
                'title' => 'University consortium launches cross-border robotics challenge for student teams',
                'excerpt' => 'A demo Asia story built to exercise technology, education and regional article layouts.',
                'category' => 'asia', 'region' => 'Asia', 'location' => 'Seoul', 'author' => 'maya',
                'tags' => ['asia', 'technology', 'science'], 'hours_ago' => 27, 'views' => 16400, 'read_time' => 4,
            ],
            [
                'slug' => 'americas-community-broadband-adds-public-wifi',
                'title' => 'Community broadband projects add public Wi-Fi around libraries and transit hubs',
                'excerpt' => 'A fictional Americas fixture about locally operated connectivity projects and public digital access.',
                'category' => 'americas', 'region' => 'Americas', 'location' => 'Austin', 'author' => 'leo',
                'tags' => ['technology', 'policy', 'business'], 'hours_ago' => 30, 'views' => 15200, 'read_time' => 5,
            ],
            [
                'slug' => 'europe-manufacturers-adopt-digital-product-passports',
                'title' => 'Small manufacturers adopt digital product passports for repair and reuse',
                'excerpt' => 'A demo Europe report on product data designed to make maintenance and material recovery easier.',
                'category' => 'europe', 'region' => 'Europe', 'location' => 'Copenhagen', 'author' => 'maya',
                'tags' => ['europe', 'business', 'climate'], 'hours_ago' => 33, 'views' => 22200, 'read_time' => 6,
            ],
            [
                'slug' => 'middle-east-solar-microgrids-power-remote-service-centers',
                'title' => 'Solar microgrids power remote service centers in new regional pilots',
                'excerpt' => 'A fictional Middle East fixture on distributed energy systems supporting clinics and community services.',
                'category' => 'middle-east', 'region' => 'Middle East', 'location' => 'Muscat', 'author' => 'noah',
                'tags' => ['energy', 'climate', 'technology'], 'hours_ago' => 36, 'views' => 17400, 'read_time' => 5,
            ],
            [
                'slug' => 'small-firms-shift-to-instant-invoice-reconciliation',
                'title' => 'Small firms shift to faster invoice reconciliation as payment tools improve',
                'excerpt' => 'A demo business article showing how finance workflows can be presented in the SP-Tools editorial system.',
                'category' => 'business', 'region' => 'Global', 'location' => 'Sydney', 'author' => 'leo',
                'tags' => ['business', 'markets', 'economy'], 'hours_ago' => 40, 'views' => 24500, 'read_time' => 5,
            ],
            [
                'slug' => 'browser-privacy-tools-add-local-ai-summarization',
                'title' => 'Browser privacy tools add local AI summarization without sending page text away',
                'excerpt' => 'A fictional technology demo story about on-device summarization and privacy-focused browser workflows.',
                'category' => 'technology', 'region' => 'Global', 'location' => 'Tokyo', 'author' => 'maya',
                'tags' => ['ai', 'technology', 'security'], 'hours_ago' => 43, 'views' => 48200, 'read_time' => 7,
            ],
            [
                'slug' => 'marine-sensors-map-seasonal-reef-temperatures',
                'title' => 'Marine sensors map seasonal reef temperatures at finer local scales',
                'excerpt' => 'A demo science fixture about compact sensors, shared datasets and changing coastal conditions.',
                'category' => 'science', 'region' => 'Asia', 'location' => 'Bali', 'author' => 'amira',
                'tags' => ['science', 'climate', 'asia'], 'hours_ago' => 47, 'views' => 13900, 'read_time' => 6,
            ],
            [
                'slug' => 'cities-trial-reflective-pavement-corridors',
                'title' => 'Cities trial reflective pavement corridors on high-heat walking routes',
                'excerpt' => 'A fictional climate report on materials, shade and street-level measurements during hotter months.',
                'category' => 'climate', 'region' => 'Americas', 'location' => 'Phoenix', 'author' => 'noah',
                'tags' => ['climate', 'science', 'policy'], 'hours_ago' => 51, 'views' => 20700, 'read_time' => 5,
            ],
            [
                'slug' => 'clinics-add-same-day-digital-triage-slots',
                'title' => 'Clinics add same-day digital triage slots for routine questions',
                'excerpt' => 'A demo health story about balancing digital intake with clear escalation to in-person care.',
                'category' => 'health', 'region' => 'Europe', 'location' => 'Helsinki', 'author' => 'amira',
                'tags' => ['health', 'technology', 'europe'], 'hours_ago' => 55, 'views' => 19200, 'read_time' => 5,
            ],
            [
                'slug' => 'emergency-agencies-test-satellite-mapping-exchange',
                'title' => 'Emergency agencies test a shared satellite-mapping exchange for rapid assessments',
                'excerpt' => 'A fictional world fixture about standardizing map layers during large multi-agency response exercises.',
                'category' => 'world', 'region' => 'Global', 'location' => 'Geneva', 'author' => 'noah',
                'tags' => ['global', 'security', 'technology'], 'hours_ago' => 59, 'views' => 33600, 'read_time' => 7,
            ],
            [
                'slug' => 'logistics-teams-deploy-reusable-packaging-tracking',
                'title' => 'Logistics teams deploy reusable packaging tracking across regional routes',
                'excerpt' => 'A demo business report on returnable shipping containers and the data needed to keep them in circulation.',
                'category' => 'business', 'region' => 'Asia', 'location' => 'Ho Chi Minh City', 'author' => 'leo',
                'tags' => ['business', 'trade', 'climate'], 'hours_ago' => 63, 'views' => 22600, 'read_time' => 5,
            ],
            [
                'slug' => 'edge-devices-cut-inference-power-use-field-tests',
                'title' => 'Edge devices cut AI inference power use in field-test deployments',
                'excerpt' => 'A fictional technology fixture about smaller models, low-power accelerators and offline workflows.',
                'category' => 'technology', 'region' => 'Asia', 'location' => 'Taipei', 'author' => 'maya',
                'tags' => ['ai', 'technology', 'energy'], 'hours_ago' => 67, 'views' => 39900, 'read_time' => 7,
            ],
            [
                'slug' => 'southeast-asia-makers-expand-open-hardware-labs',
                'title' => 'Southeast Asian maker groups expand open-hardware labs for local prototypes',
                'excerpt' => 'A demo Asia feature about shared tools, open designs and practical engineering communities.',
                'category' => 'asia', 'region' => 'Asia', 'location' => 'Phnom Penh', 'author' => 'amira',
                'tags' => ['asia', 'technology', 'science'], 'hours_ago' => 71, 'views' => 28700, 'read_time' => 6,
            ],
        ];
    }
}
