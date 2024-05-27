import React, {
  DetailedHTMLProps,
  HTMLAttributes,
  memo,
  useState,
} from 'react';

import ReactMarkdown from 'react-markdown';
import { CodeProps, ReactMarkdownProps } from 'react-markdown/lib/ast-to-react';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import useStore from '@store/store';
import TickIcon from '@icon/TickIcon';
import CrossIcon from '@icon/CrossIcon';
import useSubmit from '@hooks/useSubmit';
import { codeLanguageSubset } from '@constants/chat';
import UpButton from '../button/UpButton';
import DownButton from '../button/DownButton';
import CopyButton from '../button/CopyButton';
import EditButton from '../button/EditButton';
import DeleteButton from '../button/DeleteButton';
import MarkdownModeButton from '../button/MarkdownModeButton';

import CodeBlock from '../CodeBlock';
import { AiChatMessage } from '@src/ai/data/AiChatMessage';
import { Locator } from '@src/common/data/Locator';
import { AIService } from '@src/ai/mgr/AIService';
import RefreshButton from '../button/RefreshButton';
import { useBindObjectEvent } from '@src/common/Event/WeakObjectEventService';

const ContentView = memo(
  ({
    message,
    index,
    setIsEdit,
  }: {
    index : number;
    message:AiChatMessage;
    setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    const [isDelete, setIsDelete] = useState<boolean>(false);
    const inlineLatex = useStore((state) => state.inlineLatex);
    const markdownMode = useStore((state) => state.markdownMode);
    const aiService = Locator.fetch(AIService)
    const handleDelete = () => {
      aiService.currentAiBot?.currentChat?.deleteMessage(message)
    };
    useBindObjectEvent(message)
    
    const handleMove = (direction: 'up' | 'down') => {
      if (direction === 'up') {
        aiService.currentAiBot?.currentChat?.upIndex(message)
      } else {
        aiService.currentAiBot?.currentChat?.downIndex(message)
      }
    };

    const handleMoveUp = () => {
      handleMove('up');
    };

    const handleMoveDown = () => {
      handleMove('down');
    };

    const handleRefresh = () => {
      // 刷新index的回答
      Locator.fetch(AIService).currentAiBot?.currentChat?.refresh(message)
    };

    const handleCopy = () => {
      navigator.clipboard.writeText(message.content);
    };

    return (
      <>
        <div className='markdown prose w-full md:max-w-full break-words dark:prose-invert dark share-gpt-message'>
          {markdownMode ? (
            <ReactMarkdown
              remarkPlugins={[
                remarkGfm,
                [remarkMath, { singleDollarTextMath: inlineLatex }],
              ]}
              rehypePlugins={[
                rehypeKatex,
                [
                  rehypeHighlight,
                  {
                    detect: true,
                    ignoreMissing: true,
                    subset: codeLanguageSubset,
                  },
                ],
              ]}
              linkTarget='_new'
              components={{
                code,
                p,
              }}
            >
              {message.content}
            </ReactMarkdown>
          ) : (
            <span className='whitespace-pre-wrap'>{message.content}</span>
          )}
        </div>
        <div className='flex justify-end gap-2 w-full mt-2'>
          {isDelete || (
            <>
              {!useStore.getState().generating && <RefreshButton onClick={handleRefresh} />}
              <UpButton onClick={handleMoveUp} />
              <DownButton onClick={handleMoveDown} />
              <MarkdownModeButton />
              <CopyButton onClick={handleCopy} />
              <EditButton setIsEdit={setIsEdit} />
              <DeleteButton setIsDelete={setIsDelete} />
            </>
          )}
          {isDelete && (
            <>
              <button
                className='p-1 hover:text-white'
                aria-label='cancel'
                onClick={() => setIsDelete(false)}
              >
                <CrossIcon />
              </button>
              <button
                className='p-1 hover:text-white'
                aria-label='confirm'
                onClick={handleDelete}
              >
                <TickIcon />
              </button>
            </>
          )}
        </div>
      </>
    );
  }
);

export const code = memo((props: CodeProps) => {
  const { inline, className, children } = props;
  const match = /language-(\w+)/.exec(className || '');
  const lang = match && match[1];

  if (inline) {
    return <code className={className}>{children}</code>;
  } else {
    return <CodeBlock lang={lang || 'text'} codeChildren={children} />;
  }
});

export const p = memo(
  (
    props?: Omit<
      DetailedHTMLProps<
        HTMLAttributes<HTMLParagraphElement>,
        HTMLParagraphElement
      >,
      'ref'
    > &
      ReactMarkdownProps
  ) => {
    return <p className='whitespace-pre-wrap'>{props?.children}</p>;
  }
);

export default ContentView;
