import React from 'react';
import CategoryIcon from '~/components/Prompts/Groups/CategoryIcon';
import { Label } from '~/components/ui';

export default function ListCard({
  category,
  name,
  snippet,
  onClick,
  children,
}: {
  category: string;
  name: string;
  snippet: string;
  onClick?: React.MouseEventHandler<HTMLDivElement | HTMLButtonElement>;
  children?: React.ReactNode;
}) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement | HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.(event as unknown as React.MouseEvent<HTMLDivElement | HTMLButtonElement>);
    }
  };

  return (
    <div
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className="border-border-light hover:bg-surface-tertiary relative my-2 flex w-full cursor-pointer flex-col gap-2 rounded-xl border px-3 pt-3 pb-4 text-start align-top text-[15px] shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg"
      role="button"
      tabIndex={0}
      aria-labelledby={`card-title-${name}`}
      aria-describedby={`card-snippet-${name}`}
      aria-label={`Card for ${name}`}
    >
      <div className="flex w-full justify-between gap-2">
        <div className="flex flex-row gap-2">
          <CategoryIcon category={category} className="icon-md" aria-hidden="true" />
          <Label
            id={`card-title-${name}`}
            className="break-word text-text-primary text-sm font-semibold text-balance select-none"
            title={name}
          >
            {name}
          </Label>
        </div>
        <div>{children}</div>
      </div>
      <div
        id={`card-snippet-${name}`}
        className="ellipsis text-text-secondary max-w-full text-sm text-balance select-none"
      >
        {snippet}
      </div>
    </div>
  );
}
