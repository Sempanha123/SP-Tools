<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class ContactStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'min:2',
                'max:120',
            ],

            'email' => [
                'required',
                'string',
                'email:rfc,dns',
                'max:191',
            ],

            'subject' => [
                'required',
                'string',
                'min:3',
                'max:191',
            ],

            'message' => [
                'required',
                'string',
                'min:20',
                'max:5000',
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'message.min' => 'Please give us at least 20 characters to work with.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge(array_filter([
            'name' => $this->filled('name')
                ? trim((string) $this->input('name'))
                : null,

            'email' => $this->filled('email')
                ? mb_strtolower(trim((string) $this->input('email')))
                : null,

            'subject' => $this->filled('subject')
                ? trim((string) $this->input('subject'))
                : null,

            'message' => $this->filled('message')
                ? trim((string) $this->input('message'))
                : null,
        ], static fn ($value): bool => $value !== null));
    }
}
