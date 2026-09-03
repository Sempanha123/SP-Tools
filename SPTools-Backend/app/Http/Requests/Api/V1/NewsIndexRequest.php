<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class NewsIndexRequest extends FormRequest
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
            'q' => [
                'sometimes',
                'nullable',
                'string',
                'max:200',
            ],

            'category' => [
                'sometimes',
                'nullable',
                'string',
                'max:191',
            ],

            'tag' => [
                'sometimes',
                'nullable',
                'string',
                'max:191',
            ],

            'region' => [
                'sometimes',
                'nullable',
                'string',
                'max:100',
            ],

            'date' => [
                'sometimes',
                'nullable',
                Rule::in([
                    '24h',
                    '7d',
                    '30d',
                ]),
            ],

            'sort' => [
                'sometimes',
                'nullable',
                Rule::in([
                    'latest',
                    'oldest',
                    'popular',
                ]),
            ],

            'featured' => [
                'sometimes',
                'boolean',
            ],

            'breaking' => [
                'sometimes',
                'boolean',
            ],

            'live' => [
                'sometimes',
                'boolean',
            ],

            'per_page' => [
                'sometimes',
                'integer',
                'between:1,50',
            ],

            'page' => [
                'sometimes',
                'integer',
                'min:1',
            ],
        ];
    }
}
