import { handleErrorStatus } from '@utils/api';
import IAiBotCreateDef, {
  IAiBotDef,
  IAiBotUpdateDef,
  IAiChatDef,
  IAiChatGenerateDef,
  IAiChatMessageDef,
  IAiConfigDef,
} from '@src/ai/data/AIDef';
import { BaseRpcRequest, StreamRpcRequest } from '@src/common/Net/RpcRequest';
import { Locator } from '@src/common/data/Locator';
import { UserService } from '@src/user/mgr/UserService';

const baseUrl = 'http://21hut.com:8080/v1';

export class ApiResponse {
  public code: number;
  public message: string;
  public data: any;

  constructor(code: number, message: string, data: any) {
    this.code = code;
    this.message = message;
    this.data = data;
  }
}

export const AiApi = {
  createAiBot: function (
    data: IAiBotCreateDef,
    success: (response: IAiBotDef) => void
  ) {
    const rpc = new BaseRpcRequest(baseUrl + '/bot', success, 'POST', data);
    return rpc.send();
  },
  getAiBotList: async function (success: (response: any) => void) {
    const rpc = new BaseRpcRequest(baseUrl + '/bot', success);
    return rpc.send();
  },
  getAiChatListByBotId: async function (
    botId: number,
    success: (response: any) => void
  ) {
    const rpc = new BaseRpcRequest(
      baseUrl + `/chat/list?botId=${botId}`,
      success
    );
    return rpc.send();
  },
  getFirstAiChatByBotId: async function (
    botId: string,
    success: (response: any) => void
  ) {
    const rpc = new BaseRpcRequest(baseUrl + `/chat/${botId}/first`, success);
    return rpc.send();
  },
  generateTitle: async (
    data: IAiChatGenerateDef,
    success: (response: any) => void
  ) => {
    const rpc = new BaseRpcRequest(
      baseUrl + '/chat/completions',
      success,
      'POST',
      data
    );
    return rpc.send();
  },
  createAiChat: async function (
    data: IAiChatDef,
    success: (response: any) => void
  ) {
    const rpc = new BaseRpcRequest(baseUrl + '/chat', success, 'POST', data);
    return rpc.send();
  },
  updateAiChat: async function (
    data: IAiChatDef,
    success: (response: any) => void
  ) {
    const rpc = new BaseRpcRequest(baseUrl + '/chat', success, 'PUT', data);
    return rpc.send();
  },
  deleteAiChat: async function (id: string, success: (response: any) => void) {
    const rpc = new BaseRpcRequest(baseUrl + `/chat/${id}`, success, 'DELETE');
    return rpc.send();
  },
  generateChat: async function (
    data: IAiChatGenerateDef,
    success: (response: any) => void,
    onEnd: () => void
  ) {
    const streamRpc = new StreamRpcRequest(
      baseUrl + `/chat/completions`,
      success,
      'POST',
      data,
      undefined,
      onEnd
    );
    streamRpc.send();
  },
  addMessage: async function (
    data: IAiChatMessageDef,
    success: (response: any) => void
  ) {
    const rpc = new BaseRpcRequest(baseUrl + '/message', success, 'POST', data);
    return rpc.send();
  },
  setTemplate: async function (
    data: IAiBotUpdateDef,
    success: (response: any) => void
  ) {
    const rpc = new BaseRpcRequest(
      baseUrl + '/bot/template',
      success,
      'PUT',
      data
    );
    return rpc.send();
  },
};
