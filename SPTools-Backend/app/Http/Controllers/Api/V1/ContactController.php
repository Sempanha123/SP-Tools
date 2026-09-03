<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\ContactStoreRequest;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;

class ContactController extends Controller
{
    public function store(ContactStoreRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $message = ContactMessage::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'status' => ContactMessage::STATUS_NEW,
            'ip_address' => $request->ip(),
            'user_agent' => mb_substr(
                (string) $request->userAgent(),
                0,
                255,
            ),
        ]);

        return response()->json([
            'data' => [
                'id' => (int) $message->id,
                'subject' => $message->subject,
            ],
            'message' => 'Thanks — your message is on its way. We usually reply within a couple of days.',
        ], 201);
    }
}
