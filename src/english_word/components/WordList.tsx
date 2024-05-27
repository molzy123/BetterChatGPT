// WordList.tsx
import React, { useState } from 'react';
import { WordItem } from './WordItem';
import { NewWordEntity } from '../mgr/WordApi';
import { Locator } from '@src/common/data/Locator';
import { EnglishWordService } from '../mgr/EnglishWordService';


export const WordList= ({ words }:{words:NewWordEntity[]}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  const itemsPerPage = 10;
  const pages = Math.ceil(words.length / itemsPerPage);
  const start = currentPage * itemsPerPage;
  const currentItems = words.slice(start, start + itemsPerPage);

  const toggleCheck = (word: string) => {
    console.log(checkedItems);
    
    setCheckedItems((prev) => ({ ...prev, [word]: !prev[word] }));
  };



  return (
    <div className="flex flex-col h-full ">
      <div className="space-y-2 overflow-auto flex-grow overflow-x-hidden">
        {currentItems.map((item) => (
          <WordItem
            key={item.word}
            word={item.word}
            definition={item.exp}
            checked={!!checkedItems[item.word]}
            onToggle={() => toggleCheck(item.word)}
          />
        ))}
      </div>
      <div className="flex justify-center h-12 items-center">
        <button
          className="mx-2 px-3 py-1 text-sm border border-gray-600 rounded bg-gray-700 text-gray-300"
          disabled={currentPage <= 0}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <button
          className="mx-2 px-3 py-1 text-sm border border-gray-600 rounded bg-gray-700 text-gray-300"
          disabled={currentPage >= pages - 1}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>

        <button
          className="mx-2 px-3 py-1 text-sm border border-gray-600 rounded bg-gray-700 text-gray-300"
          disabled={currentPage >= pages - 1}
          onClick={() => {
            Locator.fetch(EnglishWordService).generateArticle(Object.keys(checkedItems));
          }}
        >
          generating
        </button>
      </div>
    </div>
  );
};
