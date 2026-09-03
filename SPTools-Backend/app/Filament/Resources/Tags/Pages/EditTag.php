<?php

namespace App\Filament\Resources\Tags\Pages;

use App\Filament\Resources\Tags\TagResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditTag extends EditRecord
{
    protected static string $resource =
        TagResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make()
                ->requiresConfirmation()
                ->disabled(
                    fn (): bool => $this
                        ->getRecord()
                        ->articles()
                        ->exists(),
                )
                ->tooltip(
                    fn (): ?string => $this
                        ->getRecord()
                        ->articles()
                        ->exists()
                            ? 'Remove this tag from its articles before deleting it.'
                            : null,
                ),
        ];
    }
}