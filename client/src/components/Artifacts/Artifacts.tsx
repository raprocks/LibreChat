import { useRef, useState, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import * as Tabs from '@radix-ui/react-tabs';
import { ArrowLeft, ChevronLeft, ChevronRight, RefreshCw, X } from 'lucide-react';
import type { SandpackPreviewRef, CodeEditorRef } from '@codesandbox/sandpack-react';
import useArtifacts from '~/hooks/Artifacts/useArtifacts';
import DownloadArtifact from './DownloadArtifact';
import { useEditorContext } from '~/Providers';
import useLocalize from '~/hooks/useLocalize';
import ArtifactTabs from './ArtifactTabs';
import { CopyCodeButton } from './Code';
import store from '~/store';

export default function Artifacts() {
  const localize = useLocalize();
  const { isMutating } = useEditorContext();
  const editorRef = useRef<CodeEditorRef>();
  const previewRef = useRef<SandpackPreviewRef>();
  const [isVisible, setIsVisible] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const setArtifactsVisible = useSetRecoilState(store.artifactsVisibility);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const {
    activeTab,
    isMermaid,
    setActiveTab,
    currentIndex,
    isSubmitting,
    cycleArtifact,
    currentArtifact,
    orderedArtifactIds,
  } = useArtifacts();

  if (currentArtifact === null || currentArtifact === undefined) {
    return null;
  }

  const handleRefresh = () => {
    setIsRefreshing(true);
    const client = previewRef.current?.getClient();
    if (client != null) {
      client.dispatch({ type: 'refresh' });
    }
    setTimeout(() => setIsRefreshing(false), 750);
  };

  const closeArtifacts = () => {
    setIsVisible(false);
    setTimeout(() => setArtifactsVisible(false), 300);
  };

  return (
    <Tabs.Root value={activeTab} onValueChange={setActiveTab} asChild>
      {/* Main Parent */}
      <div className="flex h-full w-full items-center justify-center">
        {/* Main Container */}
        <div
          className={`border-border-medium bg-surface-primary text-text-primary flex h-full w-full flex-col overflow-hidden border text-xl shadow-xl transition-all duration-500 ease-in-out ${
            isVisible ? 'blur-0 scale-100 opacity-100' : 'scale-105 opacity-0 blur-sm'
          }`}
        >
          {/* Header */}
          <div className="border-border-medium bg-surface-primary-alt flex items-center justify-between border-b p-2">
            <div className="flex items-center">
              <button className="text-text-secondary mr-2" onClick={closeArtifacts}>
                <ArrowLeft className="h-4 w-4" />
              </button>
              <h3 className="text-text-primary truncate text-sm">{currentArtifact.title}</h3>
            </div>
            <div className="flex items-center">
              {/* Refresh button */}
              {activeTab === 'preview' && (
                <button
                  className={`text-text-secondary mr-2 transition-transform duration-500 ease-in-out ${
                    isRefreshing ? 'rotate-180' : ''
                  }`}
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  aria-label="Refresh"
                >
                  <RefreshCw
                    size={16}
                    className={`transform ${isRefreshing ? 'animate-spin' : ''}`}
                  />
                </button>
              )}
              {activeTab !== 'preview' && isMutating && (
                <RefreshCw size={16} className="text-text-secondary mr-2 animate-spin" />
              )}
              {/* Tabs */}
              <Tabs.List className="border-border-medium bg-surface-tertiary mr-2 inline-flex h-7 rounded-full border">
                <Tabs.Trigger
                  value="preview"
                  disabled={isMutating}
                  className="border-0.5 text-text-secondary data-[state=active]:border-border-light data-[state=active]:bg-surface-primary-alt data-[state=active]:text-text-primary flex items-center gap-1 rounded-full border-transparent py-1 pr-2.5 pl-2.5 text-xs font-medium"
                >
                  {localize('com_ui_preview')}
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="code"
                  className="border-0.5 text-text-secondary data-[state=active]:border-border-light data-[state=active]:bg-surface-primary-alt data-[state=active]:text-text-primary flex items-center gap-1 rounded-full border-transparent py-1 pr-2.5 pl-2.5 text-xs font-medium"
                >
                  {localize('com_ui_code')}
                </Tabs.Trigger>
              </Tabs.List>
              <button className="text-text-secondary" onClick={closeArtifacts}>
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          {/* Content */}
          <ArtifactTabs
            isMermaid={isMermaid}
            artifact={currentArtifact}
            isSubmitting={isSubmitting}
            editorRef={editorRef as React.MutableRefObject<CodeEditorRef>}
            previewRef={previewRef as React.MutableRefObject<SandpackPreviewRef>}
          />
          {/* Footer */}
          <div className="border-border-medium bg-surface-primary-alt text-text-secondary flex items-center justify-between border-t p-2 text-sm">
            <div className="flex items-center">
              <button onClick={() => cycleArtifact('prev')} className="text-text-secondary mr-2">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs">{`${currentIndex + 1} / ${
                orderedArtifactIds.length
              }`}</span>
              <button onClick={() => cycleArtifact('next')} className="text-text-secondary ml-2">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <CopyCodeButton content={currentArtifact.content ?? ''} />
              {/* Download Button */}
              <DownloadArtifact artifact={currentArtifact} />
              {/* Publish button */}
              {/* <button className="border-0.5 min-w-[4rem] whitespace-nowrap rounded-md border-border-medium bg-[radial-gradient(ellipse,_var(--tw-gradient-stops))] from-surface-active from-50% to-surface-active px-3 py-1 text-xs font-medium text-text-primary transition-colors hover:bg-surface-active hover:text-text-primary active:scale-[0.985] active:bg-surface-active">
                Publish
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </Tabs.Root>
  );
}
