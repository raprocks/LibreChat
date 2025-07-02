import React from 'react';
import { HoverCard, HoverCardTrigger, HoverCardPortal, HoverCardContent } from '~/components/ui';
import { CircleHelpIcon } from '~/components/svg';
import { useLocalize } from '~/hooks';

const HoverCardSettings = ({ side, text }) => {
  const localize = useLocalize();

  return (
    <HoverCard openDelay={500}>
      <HoverCardTrigger>
        <CircleHelpIcon className="text-text-tertiary h-5 w-5" />{' '}
      </HoverCardTrigger>
      <HoverCardPortal>
        <HoverCardContent side={side} className="z-[999] w-80">
          <div className="space-y-2">
            <p className="text-text-secondary text-sm">{localize(text)}</p>
          </div>
        </HoverCardContent>
      </HoverCardPortal>
    </HoverCard>
  );
};

export default HoverCardSettings;
