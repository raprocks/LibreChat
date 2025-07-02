import { memo } from 'react';
import CodeArtifacts from './CodeArtifacts';
import ChatBadges from './ChatBadges';

function Beta() {
  return (
    <div className="text-text-primary flex flex-col gap-3 p-1 text-sm">
      <div className="pb-3">
        <CodeArtifacts />
      </div>
      {/* <div className="pb-3">
        <ChatBadges />
      </div> */}
    </div>
  );
}

export default memo(Beta);
