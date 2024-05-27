// src/Article.tsx
import RightClickMenu, { MenuItemData, RightClickMenuProps } from '@components/Menu/RightClickMenu';
import { codeLanguageSubset } from '@constants/chat';
import { code, p } from '@src/ai/components/message/view/ContentView';
import { AiChatMessage } from '@src/ai/data/AiChatMessage';
import { ContextMenuService } from '@src/common/ContextMenu/ContextMenuService';
import { useBindObjectEvent } from '@src/common/Event/WeakObjectEventService';
import { Locator } from '@src/common/data/Locator';
import useStore from '@store/store';
import React, { MouseEventHandler, useCallback, useEffect } from 'react';
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
    <div className="flex flex-col items-center w-full">
      <div className=" bg-gray-700 w-[50%] pt-5 text-gray-100 text-lg flex-grow overflow-auto overflow-x-hidden"
        // onContextMenu={handleRightClick}
        onMouseUp={handleRightClick}>
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
      <div className="bg-gray-400 h-[50px] w-full">

      </div>
    </div>


  );
};

export default Article;