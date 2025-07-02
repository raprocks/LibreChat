import * as Popover from '@radix-ui/react-popover';
import useLocalize from '~/hooks/useLocalize';

export default function ToolPopover({
  input,
  output,
  domain,
  function_name,
  pendingAuth,
}: {
  input: string;
  function_name: string;
  output?: string | null;
  domain?: string;
  pendingAuth?: boolean;
}) {
  const localize = useLocalize();
  const formatText = (text: string) => {
    try {
      return JSON.stringify(JSON.parse(text), null, 2);
    } catch {
      return text;
    }
  };

  let title =
    domain != null && domain
      ? localize('com_assistants_domain_info', { 0: domain })
      : localize('com_assistants_function_use', { 0: function_name });
  if (pendingAuth === true) {
    title =
      domain != null && domain
        ? localize('com_assistants_action_attempt', { 0: domain })
        : localize('com_assistants_attempt_info');
  }

  return (
    <Popover.Portal>
      <Popover.Content
        side="bottom"
        align="start"
        sideOffset={12}
        alignOffset={-5}
        className="bg-surface-primary w-18 max-w-sm min-w-[180px] rounded-lg px-1"
      >
        <div tabIndex={-1}>
          <div className="bg-token-surface-primary max-w-sm rounded-md p-2 shadow-[0_0_24px_0_rgba(0,0,0,0.05),inset_0_0.5px_0_0_rgba(0,0,0,0.05),0_2px_8px_0_rgba(0,0,0,0.05)]">
            <div className="text-text-primary mb-2 text-sm font-medium">{title}</div>
            <div className="bg-token-surface-secondary text-token-text-primary dark rounded-md text-xs">
              <div className="bg-surface-tertiary max-h-32 overflow-y-auto rounded-md p-2">
                <code className="!whitespace-pre-wrap">{formatText(input)}</code>
              </div>
            </div>
            {output != null && output && (
              <>
                <div className="text-text-primary mt-2 mb-2 text-sm font-medium">
                  {localize('com_ui_result')}
                </div>
                <div className="bg-token-surface-secondary text-token-text-primary dark rounded-md text-xs">
                  <div className="bg-surface-tertiary max-h-32 overflow-y-auto rounded-md p-2">
                    <code className="!whitespace-pre-wrap">{formatText(output)}</code>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Popover.Content>
    </Popover.Portal>
  );
}
