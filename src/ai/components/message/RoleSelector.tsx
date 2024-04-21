import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from '@store/store';

import DownChevronArrow from '@icon/DownChevronArrow';
import { ChatInterface, Role, roles } from '@type/chat';

import useHideOnOutsideClick from '@hooks/useHideOnOutsideClick';
import { IAiChatDef } from '@src/ai/data/AIDef';
import { put } from '@src/common/utils/CommonRequest';
import { AiChatMessage } from '@src/ai/data/AiChatMessage';

const RoleSelector = React.memo(
  ({
    message,
    sticky,
  }: {
    message: AiChatMessage
    sticky?: boolean;
  }) => {
    const { t } = useTranslation();
    const setInputRole = useStore((state) => state.setInputRole);

    const [dropDown, setDropDown, dropDownRef] = useHideOnOutsideClick();

    return (
      <div className='prose dark:prose-invert relative'>
        <button
          className='btn btn-neutral btn-small flex gap-1'
          aria-label={t(message.role) as string}
          type='button'
          onClick={() => setDropDown((prev) => !prev)}
        >
          {t(message.role)}
          <DownChevronArrow />
        </button>
        <div
          ref={dropDownRef}
          id='dropdown'
          className={`${
            dropDown ? '' : 'hidden'
          } absolute top-100 bottom-100 z-10 bg-white rounded-lg shadow-xl border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group dark:bg-gray-800 opacity-90`}
        >
          <ul
            className='text-sm text-gray-700 dark:text-gray-200 p-0 m-0'
            aria-labelledby='dropdownDefaultButton'
          >
            {roles.map((r) => (
              <li
                className='px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer'
                onClick={() => {
                  if (!sticky) {
                    message.role = r
                  } else {
                    setInputRole(r);
                  }
                  setDropDown(false);
                }}
                key={r}
              >
                {t(r)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
);
export default RoleSelector;
