import { memo } from 'react';
import { PermissionTypes, Permissions } from 'librechat-data-provider';
import HoverCardSettings from '~/components/Nav/SettingsTabs/HoverCardSettings';
import { useLocalize, useHasAccess } from '~/hooks';
import SlashCommandSwitch from './SlashCommandSwitch';
import PlusCommandSwitch from './PlusCommandSwitch';
import AtCommandSwitch from './AtCommandSwitch';

function Commands() {
  const localize = useLocalize();

  const hasAccessToPrompts = useHasAccess({
    permissionType: PermissionTypes.PROMPTS,
    permission: Permissions.USE,
  });

  const hasAccessToMultiConvo = useHasAccess({
    permissionType: PermissionTypes.MULTI_CONVO,
    permission: Permissions.USE,
  });

  return (
    <div className="space-y-4 p-1">
      <div className="flex items-center gap-2">
        <h3 className="text-text-primary text-lg font-medium">
          {localize('com_nav_chat_commands')}
        </h3>
        <HoverCardSettings side="bottom" text="com_nav_chat_commands_info" />
      </div>
      <div className="text-text-primary flex flex-col gap-3 text-sm">
        <div className="pb-3">
          <AtCommandSwitch />
        </div>
        {hasAccessToMultiConvo === true && (
          <div className="pb-3">
            <PlusCommandSwitch />
          </div>
        )}
        {hasAccessToPrompts === true && (
          <div className="pb-3">
            <SlashCommandSwitch />
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(Commands);
