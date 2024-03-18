import React, { useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import useStore from '@store/store';
import useHideOnOutsideClick from '@hooks/useHideOnOutsideClick';
import PopupModal from '@components/PopupModal';
import { availableEndpoints, defaultAPIEndpoint } from '@constants/auth';
import DownChevronArrow from '@icon/DownChevronArrow';
import { getSelfInfo, getToken } from '@api/user-api';

const UserLogin = ({ setIsModalOpen, }: { setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>; }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const setUserToken = useStore((state) => state.setUserToken);
  const userToken = useStore((state) => state.userToken);
  const handleLogin = async () => {
    // 处理登录逻辑，例如 API 调用等
    console.log('登录:', username, password);
    const token = await getToken(username, password);
    // const info = await getSelfInfo("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJsaW56eSIsImV4cCI6MTcxMDY2OTY2OH0.j-rq6MFCkS_rei1L6R8KNj38YEm3isjgz0-ISUT-I2Q");

    console.log('登录成功，Token: ' + token);
    setUserToken(token);
    // 关闭模态框
    setIsModalOpen(false);
  };

  const modalTitle = 'User Login'; // 标题可以根据需要国际化

  return (
    <PopupModal
      title={modalTitle}
      setIsModalOpen={setIsModalOpen}
      handleConfirm={handleLogin}
      cancelButton={true}
    >
      <div className='p-6' style={{ width:"500px" }}>
        <div className='mb-4'>
          <label htmlFor='username' className='block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
            Username
          </label>
          <input
            type='text'
            id='username'
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white'
            placeholder='Enter your username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className='mb-4'>
          <label htmlFor='password' className='block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
            Password
          </label>
          <input
            type='password'
            id='password'
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white'
            placeholder='Enter your password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </div>
    </PopupModal>

  );
};
export default UserLogin;
