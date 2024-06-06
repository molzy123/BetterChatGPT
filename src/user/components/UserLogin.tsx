import React, { useEffect, useState } from 'react';
import useStore from '@store/store';
import ReactDOM from 'react-dom';
import { Locator } from '@src/common/data/Locator';
import { UserService } from '@src/user/mgr/UserService';
import { PopupService } from '@src/common/Popup/PopupService';

const UserLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const setUserToken = useStore((state) => state.setUserToken);
  const userToken = useStore((state) => state.userToken);
  const [isLogin, setIsLogin] = useState(true);
  const userService = Locator.fetch(UserService)

  console.log("><>>>>>userlogin");

  const handleLogin = async () => {
    userService.login(username, password)
  };

  const handleRegister = async () => {

    userService.register(username, password, email, function () {
      setIsLogin(true);
    })
  }

  const register = function () {
    setIsLogin(false);
  }


  return (ReactDOM.createPortal(
    <div className='fixed top-0 left-0 z-[999] w-full p-4 overflow-x-hidden overflow-y-auto h-full flex justify-center items-center'>
      <div className="container max-w-lg max-auto grid  bg-gray-600 border-2 px-14 border-gray-400 rounded-xl p-8">
        <div className="h-10 text-center">
          <h2 className=" text-2xl text-gray-300 font-bold mb-4">{isLogin ? "login" : "register"}</h2>
        </div>
        <div>
          <div className="mb-4">
            <label htmlFor="username" className="text-gray-300">
              用户名：
            </label>
            <input
              id="username"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400"
              placeholder="请输入用户名"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>
          {isLogin == false && <div className={"mb-4"} >
            <label htmlFor="email" className="text-gray-700">
              邮箱地址：
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400"
              placeholder="请输入邮箱地址"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>}
          <div className="mb-6">
            <label htmlFor="password" className="text-gray-300">
              密码：
            </label>
            <input
              type="password"
              id="password"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400"
              placeholder="请输入密码"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <div className={"flex justify-end pb-5"}>
            <p className="text-gray-300">
              还没有账号？<a href={"#"} onClick={register} className="text-blue-400 hover:underline">注册</a>
            </p>
          </div>
          <div className="grid grid-cols-4">
            <div className="col-start-2 flex justify-center">
              <button
                type={"submit"}
                onClick={isLogin ? handleLogin : handleRegister}
                className="bg-slate-700 text-white py-2 px-4 rounded-md hover:bg-slate-800 focus:outline-none focus:bg-slate-800"
              >
                {isLogin ? "Login" : "Register"}
              </button>
            </div>
            <div className="flex justify-center">
              {/* <button onClick={handleClose} className="bg-slate-700 text-white py-2 px-4 rounded-md hover:bg-slate-800 focus:outline-none focus:bg-slate-800">
                Cancel
              </button> */}
            </div>
          </div>
        </div>
      </div>
      <div className='bg-gray-800/90 absolute top-0 left-0 h-full w-full z-[-1]'
      />
    </div>
    , document.getElementById('modal-root') as HTMLElement)
  );
};
export default UserLogin;
