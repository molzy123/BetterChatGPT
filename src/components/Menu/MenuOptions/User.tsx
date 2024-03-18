import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import PersonIcon from '@icon/PersonIcon';
import ApiMenu from '@components/ApiMenu';
import UserLogin from '@components/UserMenu';
import useStore from '@store/store';

const User = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const userToken = useRef<String>();

  useEffect(() => {
    userToken.current = useStore.getState().userToken;

    useStore.subscribe((state) => {
      if(state.userToken == "")
      {
        setIsModalOpen(true);
      }
    })

  });

  return (
    <>
      <a
        className='flex py-2 px-2 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm'
        id='api-menu'
        onClick={() => {
          const isLogin = userToken.current !== "";
          if(!isLogin)
          {
            setIsModalOpen(true)
          }else
          {
            console.log("token:",userToken)
          }
        }}
      >
        <PersonIcon />
        {"用户"}
      </a>
      {isModalOpen && <UserLogin setIsModalOpen={setIsModalOpen} />}
    </>
  );
};

export default User;
