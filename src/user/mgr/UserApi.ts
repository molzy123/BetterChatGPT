import { BaseRpcRequest } from '@src/common/Net/RpcRequest';

export const UserApi = {
  getToken : async (username:string,password:string,success:(response:any)=>void) => {
    // 创建一个 FormData 实例
    let formData = new FormData();
    formData.set('username', username)
    formData.set('password', password)
    const rpc = new BaseRpcRequest("http://127.0.0.1:8000/token",success,"POST",formData)
    rpc.headers = {};
    await rpc.send()
  },

  registerUser : async (username:string,password:string,email:string,success:(response:any)=>void) => {
    const body = {
      "username":username,
      "password":password,
      "email":email
    }
    // 使用BaseRpcRequest发送请求
    const rpc = new BaseRpcRequest("http://127.0.0.1:8000/user/",success,"POST",body)
    await rpc.send()
  },

  getUser : async (success:(response:any)=>void) => {
    const rpc = new BaseRpcRequest("http://127.0.0.1:8000/user/",success)
    await rpc.send()
  }
}


