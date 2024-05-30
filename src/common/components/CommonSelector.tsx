import React, { useRef, useState } from 'react';
import DownChevronArrow from '@icon/DownChevronArrow';
import {ModelOptions } from '@type/chat';
interface CommonSelectorItem {
  name: ModelOptions;
}

interface CommonSelectorProps {
  defaultIndex: number;
  items: Array<CommonSelectorItem>;
  selectChange: (item: CommonSelectorItem) => void;
}

export const CommonSelector = (data: CommonSelectorProps) => {
  const [dropDown, setDropDown] = useState<boolean>(false);
  const [curIndex, setCurIndex] = useState<number>(data.defaultIndex);
  return (
    <div className='mb-4 flex'>
      <div className='flex items-center flex-0 min-w-[70px] max-w-[100px]  text-sm font-medium text-gray-900 dark:text-white'>
        <p>model</p>
      </div>
      <div className={"flex-grow flex gap-1"}>
        <button
          className='flex flex-grow btn btn-neutral'
          type='button'
          onClick={() => setDropDown((prev) => !prev)}
          aria-label='model'
        >
          {data.items[curIndex].name}
          <DownChevronArrow />

        </button>
        <div id='dropdown' className={`${dropDown ? '' : 'hidden'} mt-10 px-6 flex-col absolute left-0 w-full z-10 `}>
          <ul
            className='text-sm text-gray-700 dark:text-gray-200 p-0 m-0 bg-white rounded-lg shadow-xl border-b border-black/10 dark:border-gray-900/50 group dark:bg-gray-800 opacity-90'
            aria-labelledby='dropdownDefaultButton'
          >
            {data.items.map((m, index) => (
              <li className='px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer'
                  onClick={() => {
                    data.selectChange(m);
                    setCurIndex(index)
                    setDropDown(false);
                  }}
                  key={index}
              >
                {m.name}
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
};

export default CommonSelector;