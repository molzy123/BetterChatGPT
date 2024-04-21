import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import PersonIcon from '@icon/PersonIcon';
import ApiMenu from '@components/ApiMenu';
import UserLogin from '@components/UserMenu';
import useStore from '@store/store';
import { Locator } from '@src/common/data/Locator';
import { UserService } from '@src/user/mgr/UserService';

const User = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const userToken = useRef<String>();
  const userService = Locator.fetch(UserService)
  useEffect(() => {
    userToken.current = userService.accessToken;
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
        {"次数："}
      </a>
      {isModalOpen && <UserLogin setIsModalOpen={setIsModalOpen} />}
    </>
  );
};

export default User;
