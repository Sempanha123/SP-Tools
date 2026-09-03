<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\NewsletterSubscribeRequest;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    /**
     * Subscribe an address.
     *
     * Deliberately idempotent and non-enumerable: re-subscribing an existing
     * address returns the same 200 as a fresh signup, so the endpoint cannot
     * be used to test whether an address is already on the list.
     */
    public function subscribe(
        NewsletterSubscribeRequest $request,
    ): JsonResponse {
        $validated = $request->validated();

        $subscriber = NewsletterSubscriber::query()
            ->where('email', $validated['email'])
            ->first();

        if ($subscriber === null) {
            $subscriber = NewsletterSubscriber::create([
                'email' => $validated['email'],
                'status' => NewsletterSubscriber::STATUS_ACTIVE,
                'source' => $validated['source'] ?? 'website',
                'token' => NewsletterSubscriber::freshToken(),
                'confirmed_at' => now(),
                'ip_address' => $request->ip(),
                'user_agent' => mb_substr(
                    (string) $request->userAgent(),
                    0,
                    255,
                ),
            ]);
        } elseif (! $subscriber->isActive()) {
            /* Re-subscribing after an opt-out reactivates the record. */
            $subscriber->confirm();
        }

        return response()->json([
            'data' => [
                'email' => $subscriber->email,
                'status' => $subscriber->status,
            ],
            'message' => 'You are subscribed. Watch your inbox for the next briefing.',
        ]);
    }

    /**
     * Opt out using the token embedded in every email.
     */
    public function unsubscribe(Request $request): JsonResponse
    {
        $token = (string) $request->query('token', '');

        if ($token === '') {
            return response()->json([
                'message' => 'An unsubscribe token is required.',
            ], 422);
        }

        $subscriber = NewsletterSubscriber::query()
            ->where('token', $token)
            ->first();

        /* Same response either way — the token space is not enumerable. */
        $subscriber?->unsubscribe();

        return response()->json([
            'message' => 'You have been unsubscribed.',
        ]);
    }
}
