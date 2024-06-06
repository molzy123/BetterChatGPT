// src/Article.tsx
import RightClickMenu, { MenuItemData, RightClickMenuProps } from '@components/Menu/RightClickMenu';
import { codeLanguageSubset } from '@constants/chat';
import { code, p } from '@src/ai/components/message/view/ContentView';
import { AiChatMessage } from '@src/ai/data/AiChatMessage';
import { ContextMenuService } from '@src/common/ContextMenu/ContextMenuService';
import { useBindObjectEvent } from '@src/common/Event/WeakObjectEventService';
import { CommonTextInput } from '@src/common/components/CommonTextInput';
import { Locator } from '@src/common/System/Locator';
import useStore from '@store/store';
import React, { MouseEventHandler, useCallback, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

interface ArticleProps {
  message: AiChatMessage;
}

const Article: React.FC<ArticleProps> = ({ message }) => {
  useBindObjectEvent(message);
  const [prompt, setPrompt] = useState<string>('');
  const inlineLatex = useStore((state) => state.inlineLatex);
  const handleRightClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    // 阻止默认的上下文菜单显示
    event.preventDefault();
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      var itemList: MenuItemData[] = []
      const selectContent = selection.toString();
      itemList.push({
        name: '引用', 
        action: () => {
          console.log(">>>>选择的内容", selectContent);
        }
      })
      var props: RightClickMenuProps = {
        menuItemList: itemList
      }
      Locator.fetch(ContextMenuService).showContextMenu(RightClickMenu, event, props)
      console.log(window.getSelection()?.toString());
    }
  }, []);
  return (
    <div className="flex flex-col items-center w-full  ">
      <div className=" bg-gray-700 flex w-full justify-between text-gray-100  flex-1 overflow-auto overflow-x-hidden"
        // onContextMenu={handleRightClick}
        onMouseUp={handleRightClick}>
          <div className="w-20 bg-gray-700">

          </div>

        <div className=" w-[500px] pt-5 text-lg">
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
        </div>
        <div className="w-20 bg-gray-700">

          </div>
      </div>
      <div className="bg-gray-700 h-[70px] flex-grow-0 w-full flex-shrink-0 flex items-center  overflow-hidden">
        <div className="w-full p-4">
          <CommonTextInput hintText="prompt" value={prompt} onChange={setPrompt} maxHeight={50} />
        </div>
        
      </div>
    </div>


  );
};

export default Article;