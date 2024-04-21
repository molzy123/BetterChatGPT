import React, { useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import useStore from '@store/store';
import useHideOnOutsideClick from '@hooks/useHideOnOutsideClick';
import PopupModal from '@components/PopupModal';
import { availableEndpoints, defaultAPIEndpoint } from '@constants/auth';
import DownChevronArrow from '@icon/DownChevronArrow';
import ReactDOM from 'react-dom';


const UserInfo = () => {
  const user = {
    name: 'John',
    age: 25,
    gender: 'Male',
    address: '123 Main St, City',
    phone: '123-456-7890',
    email: 'john@example.com',
    occupation: 'Software Engineer',
    education: 'Bachelor of Science',
    avatar: 'https://randomuser.me/api/portraits'

  };
  const [activeTab, setActiveTab] = useState('profile');

  const handleTabChange = ({ tab }: { tab: any }) => {
    setActiveTab(tab);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md">
        <div className="flex items-center p-6 border-b">
          <img src={user.avatar} alt="Avatar" className="h-12 w-12 rounded-full mr-4" />
          <h2 className="text-2xl font-bold">{user.name}</h2>
        </div>
        <div className="flex items-center justify-center py-4">
          <ul className="flex border-b">
            <TabItem title="个人资料" activeTab={activeTab} onClick={() => handleTabChange({ tab: 'profile' })} />
            <TabItem title="浏览历史" activeTab={activeTab} onClick={() => handleTabChange({ tab: 'history' })} />
            <TabItem title="文章列表" activeTab={activeTab} onClick={() => handleTabChange({ tab: 'articles' })} />
            {/* Add more tab items as needed */}
          </ul>
        </div>
        <div className="p-6">
          {activeTab === 'profile' && <ProfileTab user={user} />}
          {activeTab === 'history' && <HistoryTab />}
          {activeTab === 'articles' && <ArticlesTab />}
          {/* Render content for other tabs */}
        </div>
      </div>
    </div>
  );
};

const TabItem = ({ title, activeTab, onClick }:{title:string,activeTab:string,onClick:any}) => {
  return (
    <li className={` bg-slate-200 cursor-pointer border-b-4 border-blue-500 hover:bg-slate-400 rounded-sm p-2 mx-2`} onClick={onClick}>
      {title}
    </li>
  );
};

const ProfileTab = ({ user }:{user:any}) => {
  return (
    <div>
      <p className="mb-4"><span className="font-medium">年龄:</span> {user.age}</p>
      <p className="mb-4"><span className="font-medium">性别:</span> {user.gender}</p>
      <p className="mb-4"><span className="font-medium">地址:</span> {user.address}</p>
      <p className="mb-4"><span className="font-medium">电话:</span> {user.phone}</p>
      <p className="mb-4"><span className="font-medium">邮箱:</span> {user.email}</p>
      <p className="mb-4"><span className="font-medium">职业:</span> {user.occupation}</p>
      <p className="mb-4"><span className="font-medium">教育背景:</span> {user.education}</p>
      {/* Add more profile information */}
    </div>
  );
};

const HistoryTab = () => {
  return (
    <div>
      {/* Display browsing history */}
      <p>浏览历史</p>
    </div>
  );
};

const ArticlesTab = () => {
  return (
    <div>
      {/* Display user's articles */}
      <p>文章列表</p>
    </div>
  );
};

export default UserInfo;
