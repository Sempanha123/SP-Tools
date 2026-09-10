<?php

namespace Database\Seeders;

use App\Models\Article;
use Illuminate\Database\Seeder;
use RuntimeException;

class RichMediaDemoSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedOpenSourceArticle();
        $this->seedFoodLogisticsArticle();
    }

    private function seedOpenSourceArticle(): void
    {
        $article = Article::query()
            ->where('slug', 'open-source-teams-benchmark-efficient-ai-models')
            ->first();

        if (! $article) {
            throw new RuntimeException(
                'Open-source demo article not found. Run DemoNewsSeeder first.'
            );
        }

        $sections = is_array($article->sections) ? $article->sections : [];

        $sections[0] = array_merge($sections[0] ?? [], [
            'image' => 'https://picsum.photos/seed/open-source-ai-main/1400/840',
            'imageAlt' => 'Demo image for AI article layout testing.',
            'imageCaption' => 'Demo section photography for local SP-Tools UI testing.',
            'imageCredit' => 'Picsum demo image',
            'imagePosition' => 'after',
        ]);

        $sections[1] = array_merge($sections[1] ?? [], [
            'gallery' => [
                'https://picsum.photos/seed/open-source-ai-gallery-1/1200/780',
                'https://picsum.photos/seed/open-source-ai-gallery-2/1200/780',
                'https://picsum.photos/seed/open-source-ai-gallery-3/1200/780',
            ],
            'youtubeUrl' => 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
            'youtubeCaption' => 'Demo embedded video used to verify the YouTube layout.',
        ]);

        $article->update([
            'sections' => $sections,
            'lead' => 'This fictional technology fixture demonstrates richer long-form presentation with section photography, an image gallery, embedded video and stronger reading navigation.',
            'read_time_minutes' => 6,
        ]);
    }

    private function seedFoodLogisticsArticle(): void
    {
        $article = Article::query()
            ->where('slug', 'food-logistics-network-studies-cold-chain-data')
            ->first();

        if (! $article) {
            throw new RuntimeException(
                'Food logistics demo article not found. Run DemoNewsSeeder first.'
            );
        }

        $sections = is_array($article->sections) ? $article->sections : [];

        $sections[0] = array_merge($sections[0] ?? [], [
            'image' => 'https://picsum.photos/seed/cold-chain-section-main/1400/860',
            'imageAlt' => 'Demo cold-chain logistics section image.',
            'imageCaption' => 'Demo section image for testing a richer article reading flow.',
            'imageCredit' => 'Picsum demo image',
            'imagePosition' => 'after',
        ]);

        $sections[1] = array_merge($sections[1] ?? [], [
            'gallery' => [
                'https://picsum.photos/seed/cold-chain-gallery-a/1200/800',
                'https://picsum.photos/seed/cold-chain-gallery-b/1200/800',
                'https://picsum.photos/seed/cold-chain-gallery-c/1200/800',
                'https://picsum.photos/seed/cold-chain-gallery-d/1200/800',
            ],
            'youtubeUrl' => 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
            'youtubeCaption' => 'Demo video embed used only to test the SP-Tools News article player. Replace this with a relevant editorial video later.',
        ]);

        $sections[2] = array_merge($sections[2] ?? [], [
            'image' => 'https://picsum.photos/seed/cold-chain-section-next/1400/840',
            'imageAlt' => 'Second demo logistics section image.',
            'imageCaption' => 'A second visual break used to test long-form reading rhythm.',
            'imageCredit' => 'Picsum demo image',
            'imagePosition' => 'before',
        ]);

        $article->update([
            'sections' => $sections,
            'lead' => 'This fictional world-news fixture now demonstrates a richer editorial article with section photography, a four-image gallery, embedded video, structured key points and clearer reading recommendations.',
            'read_time_minutes' => 7,
        ]);
    }
}
