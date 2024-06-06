import { IModule } from '@src/common/System/Modules';
import { getClientError, handleErrorStatus } from '@utils/api';
import me from '@components/Menu/MenuOptions/Me';
import { Locator } from '@src/common/System/Locator';
import { UserService } from '@src/user/mgr/UserService';
import { parseChunk } from '@api/helper';
import { ApiResponse } from '@src/ai/mgr/AiApi';

interface IRpcRequest {
  // 请求路径
  path: string;
  // 请求方法
  method: string;
  // 请求体,要转换成json
  body: any;
  // 请求头
  headers: HeadersInit;
  // token
  token: string;
  // is Session
  isSession: boolean;
  // 发送请求
  send(): void;
}

function mergeOrFill(
  recordOne: Record<any, any>,
  recordTwo: Record<any, any>
): Record<any, any> {
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

abstract class AbstractRpc implements IRpcRequest {
  path: string = '';
  method: string = 'GET';
  token: string = '';
  _body: any = null;
  isSession: boolean = true;
  _headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': '',
  };

  get headers(): Record<string, string> {
    // 如果外部覆盖了，就说明不需要token
    if (this._headers.Authorization != undefined) {
      this._headers.Authorization = `Bearer ${this.token}`;
    }
    return this._headers;
  }

  set headers(value: Record<string, string>) {
    this._headers = value;
  }

  get body(): any {
    if (
      this.headers != undefined &&
      this.headers['Content-Type'] === 'application/json'
    ) {
      return JSON.stringify(this._body);
    } else {
      return this._body;
    }
  }

  onError(error: any): void {
    handleErrorStatus(error);
  }

  constructor(
    path: string,
    method?: string,
    body?: any,
    header?: Record<string, string>
  ) {
    this.path = path;
    this.method = method ? method : 'GET';
    this._body = body;
    this.token = Locator.fetch(UserService).accessToken;
    this._headers = header ? mergeOrFill(this.headers, header) : this.headers;
  }

  send(): void {
    throw new Error('Method not implemented.');
  }
}

export class BaseRpcRequest<T> extends AbstractRpc {
  success: (response: T) => void;

  constructor(
    path: string,
    success: (response: T) => void,
    method?: string,
    body?: any,
    header?: Record<string, string>,
    fail?: (error: any) => void
  ) {
    super(path, method, body, header);
    this.token = Locator.fetch(UserService).accessToken;
    this.onError = fail ? fail : this.onError;
    this.success = success;
  }

  // 异步发送请求
  async send(): Promise<void> {
    let response;
    try {
      response = await fetch(this.path, {
        method: this.method,
        body: this.body,
        headers: this.headers,
      });
    } catch (error) {
      this.onError(error);
    }
    if (response == undefined) {
      return;
    }
    const respData = await response.json();
    if (!response.ok) {
      respData.status = response.status;
      handleErrorStatus(JSON.stringify(respData));
      return;
    }
    this.success(respData.data);
  }
}

export class StreamRpcRequest extends AbstractRpc {
  onData: (data: any) => void;

  onEnd: () => void;

  constructor(
    path: string,
    onData: (response: any) => void,
    method?: string,
    body?: any,
    header?: Record<string, string>,
    onEnd?: () => void,
    onError?: (error: any) => void
  ) {
    super(path, method, body, header);
    this.token = Locator.fetch(UserService).accessToken;
    this.onData = onData;
    this.onEnd = onEnd ? onEnd : () => {};
    this.onError = onError ? onError : this.onError;
  }

  send: () => void = async () => {
    // 初始化请求设置
    const init: RequestInit = {
      method: this.method, // 可根据需要调整为 'POST', 'PUT', 等
      body: this.body,
      headers: this.headers,
    };

    const rpc = this;
    const response = await fetch(this.path, init);

    if (!response.ok) {
      const error = await response.json();
      error.status = response.status;
      throw new Error(JSON.stringify(error));
    }
    let stream = response.body;
    if (stream) {
      if (stream.locked) {
        throw new Error(
          getClientError(
            'Oops, the stream is locked right now. Please try again'
          )
        ); // 如果流被锁定，则抛出错误
      }
      const reader = stream.getReader(); // 获取可读流对象
      let partial = '';
      while (true) {
        const { done, value } = await reader.read(); // 读取流中的数据
        const result = parseChunk(partial + new TextDecoder().decode(value)); // 解析事件源中的数据        
        partial = '';
        if (result === '[DONE]' || done) break;

        result.forEach((curr: any) => {
          if (typeof curr === 'string') {
            partial += curr;
          } else {
            rpc.onData(curr);
          }
        });
      }
      rpc.onEnd();
    }
  };
}
