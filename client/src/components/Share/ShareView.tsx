import { memo } from 'react';
import { useParams } from 'react-router-dom';
import { useGetSharedMessages } from 'librechat-data-provider/react-query';
import { useLocalize, useDocumentTitle } from '~/hooks';
import { useGetStartupConfig } from '~/data-provider';
import { ShareContext } from '~/Providers';
import { Spinner } from '~/components/svg';
import MessagesView from './MessagesView';
import { buildTree } from '~/utils';
import Footer from '../Chat/Footer';

function SharedView() {
  const localize = useLocalize();
  const { data: config } = useGetStartupConfig();
  const { shareId } = useParams();
  const { data, isLoading } = useGetSharedMessages(shareId ?? '');
  const dataTree = data && buildTree({ messages: data.messages });
  const messagesTree = dataTree?.length === 0 ? null : (dataTree ?? null);

  // configure document title
  let docTitle = '';
  if (config?.appTitle != null && data?.title != null) {
    docTitle = `${data.title} | ${config.appTitle}`;
  } else {
    docTitle = data?.title ?? config?.appTitle ?? document.title;
  }

  useDocumentTitle(docTitle);

  let content: JSX.Element;
  if (isLoading) {
    content = (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="" />
      </div>
    );
  } else if (data && messagesTree && messagesTree.length !== 0) {
    content = (
      <>
        <div className="final-completion group mx-auto flex min-w-[40rem] flex-col gap-3 pt-4 pb-6 md:max-w-3xl md:px-5 lg:max-w-[40rem] lg:px-1 xl:max-w-[48rem] xl:px-5">
          <h1 className="text-4xl font-bold">{data.title}</h1>
          <div className="border-border-medium text-text-secondary border-b pb-6 text-base">
            {new Date(data.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
        </div>

        <MessagesView messagesTree={messagesTree} conversationId={data.conversationId} />
      </>
    );
  } else {
    content = (
      <div className="flex h-screen items-center justify-center">
        {localize('com_ui_shared_link_not_found')}
      </div>
    );
  }

  return (
    <ShareContext.Provider value={{ isSharedConvo: true }}>
      <main
        className="dark:bg-surface-secondary relative flex w-full grow overflow-hidden"
        style={{ paddingBottom: '50px' }}
      >
        <div className="transition-width dark:bg-surface-secondary relative flex h-full w-full flex-1 flex-col items-stretch overflow-hidden pt-0">
          <div className="text-text-primary flex h-full flex-col" role="presentation">
            {content}
            <div className="w-full border-t-0 pt-2 pl-0 md:w-[calc(100%-.5rem)] md:border-t-0 md:border-transparent md:pt-0 md:pl-0 md:dark:border-transparent">
              <Footer className="from-surface-secondary text-text-secondary fixed right-0 bottom-0 left-0 z-50 flex items-center justify-center gap-2 bg-gradient-to-t to-transparent px-2 pt-8 pb-2 text-xs md:px-[60px]" />
            </div>
          </div>
        </div>
      </main>
    </ShareContext.Provider>
  );
}

export default memo(SharedView);
