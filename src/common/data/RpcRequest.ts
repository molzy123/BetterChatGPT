import { IModule } from '@src/common/data/Modules';
import { handleErrorStatus } from '@utils/api';
import me from '@components/Menu/MenuOptions/Me';
import { Locator } from '@src/common/data/Locator';
import { UserService } from '@src/user/mgr/UserService';

interface IRpcRequest {
  // 请求路径
  path:string
  // 请求方法
  method:string
  // 请求体,要转换成json
  body:any
  // 请求头
  headers:HeadersInit
  // 成功回调
  success:(response:any)=>void
  // 失败回调
  fail:(error:any)=>void
  // token
  token:string
}

function mergeOrFill(recordOne: Record<any, any>, recordTwo: Record<any, any>): Record<any, any> {
  // 创建一个新对象，以避免直接修改输入的对象
  const result: Record<any, any> = { ...recordOne };
  // 遍历第一个记录的每个键值对
  Object.entries(recordTwo).forEach(([key, value]) => {
    // 如果第二个记录中有这个键，或者我们想要无条件填充，则更新/填充值
    if (result.hasOwnProperty(key)) {
      result[key] = value; // 替换
    } else {
      result[key] = value; // 填充
    }
  });
  return result;
}

export class BaseRpcRequest implements IRpcRequest{
  path: string;
  method: string;
  token: string = "";
  body: any = null;
  headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${this.token}`,
  };

  fail(error: any): void
  {
    handleErrorStatus(error)
  }
  success: (response: any) => void;

  constructor(path:string, success:(response:any)=>void,method?:string,body?:any, header?:Record<string,string>, fail?:(error:any)=>void) {
    this.path = path;
    this.method = method?method:"GET";
    this.body = body;
    this.headers = header?mergeOrFill(this.headers, header):this.headers;
    this.fail = fail?fail:this.fail;
    this.success = success;
    this.token = Locator.fetch(UserService).accessToken
  }

  //同步发送请求
  sendRequest():void{
    fetch(this.path, {
      method: this.method,
      body: this.getBody(),
      headers: this.headers,
    }).then((response)=>{
      if (!response.ok) {
        const error = response.json()
        throw new Error(JSON.stringify(error));
      }else{
        this.success(response)
      }
    }).catch((error)=>{
      this.fail(error)
    })
  }

  // 异步发送请求
  async sendRequestAsync():Promise<void>{
    try {
      const response = await fetch(this.path, {
        method: this.method,
        body: this.getBody(),
        headers: this.headers,
      });
      if (!response.ok) {
        const error = await  response.json()
        error.status = response.status
        throw new Error(JSON.stringify(error));
      }else{
        this.success(await response.json())
      }
    } catch (error) {
      this.fail(error)
    }
  }

  private getBody()
  {
    if(this.headers != undefined && this.headers["Content-Type"] === "application/json")
    {
      return JSON.stringify(this.body)
    }else{
      return this.body
    }
  }

}
