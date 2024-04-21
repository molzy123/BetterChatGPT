import { ModelOptions } from '@type/chat';
import React, { useState } from 'react';
import DownChevronArrow from '@icon/DownChevronArrow';
import { modelOptions } from '@constants/chat';

export const CommonSelecter = ({
                                _model,
                                _setModel,
                              }: {
  _model: ModelOptions;
  _setModel: React.Dispatch<React.SetStateAction<ModelOptions>>;
}) => {
  const [dropDown, setDropDown] = useState<boolean>(false);

  return (
    <div className='mb-4'>
      <button
        className='btn btn-neutral btn-small flex gap-1'
        type='button'
        onClick={() => setDropDown((prev) => !prev)}
        aria-label='model'
      >
        {_model}
        <DownChevronArrow />
      </button>
      <div
        id='dropdown'
        className={`${
          dropDown ? '' : 'hidden'
        } absolute top-100 bottom-100 z-10 bg-white rounded-lg shadow-xl border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group dark:bg-gray-800 opacity-90`}
      >
        <ul
          className='text-sm text-gray-700 dark:text-gray-200 p-0 m-0'
          aria-labelledby='dropdownDefaultButton'
        >
          {modelOptions.map((m) => (
            <li
              className='px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer'
              onClick={() => {
                _setModel(m);
                setDropDown(false);
              }}
              key={m}
            >
              {m}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CommonSelecter;