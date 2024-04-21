import { handleErrorStatus } from '@utils/api';
import IAiBotCreateDef, { IAiBotDef, IAiChatDef, IAiChatGenerateDef, IAiChatMessageDef, IAiConfigDef } from '@src/ai/data/AIDef';
import { getChatCompletion } from '@api/api';
import { BaseRpcRequest, StreamRpcRequest } from '@src/common/Net/RpcRequest';
import { Locator } from '@src/common/data/Locator';
import { UserService } from '@src/user/mgr/UserService';


export const AiApi = {
  createAiBot : function(data:IAiBotCreateDef, success:(response:IAiBotDef)=>void)
  {
    const rpc = new BaseRpcRequest("http://127.0.0.1:8000/ai/bot/",success,"POST",data)
    return rpc.send()
  },
  getAiBotList : async function(success:(response:any)=>void)
  {
    const rpc = new BaseRpcRequest("http://127.0.0.1:8000/ai/bot/",success);
    return rpc.send()
  },
  getAiChatListByBotId : async function(botId:string,success:(response:any)=>void) {
    const rpc = new BaseRpcRequest(`http://127.0.0.1:8000/ai/chat/${botId}`,success)
    return rpc.send()
  },
  getFirstAiChatByBotId : async function(botId:string,success:(response:any)=>void)
  {
    const rpc = new BaseRpcRequest(`http://127.0.0.1:8000/ai/chat/${botId}/first`,success)
    return rpc.send()
  },
  generateTitle : async (data:IAiChatGenerateDef, success:(response:any)=>void)=> {
    const rpc = new BaseRpcRequest("http://127.0.0.1:8000/ai/",success,"POST",data)
    return rpc.send()
  },
  createAiChat : async function(data:IAiChatDef, success:(response:any)=>void)
  {
    const rpc = new BaseRpcRequest("http://127.0.0.1:8000/ai/chat/",success,"POST",data)
    return rpc.send()
  },
  updateAiChat : async function(data:IAiChatDef, success:(response:any)=>void)
  {
    const rpc = new BaseRpcRequest("http://127.0.0.1:8000/ai/chat/",success,"PUT",data)
    return rpc.send()
  },
  deleteAiChat : async function(id:string, success:(response:any)=>void)
  {
    const rpc = new BaseRpcRequest(`http://127.0.0.1:8000/ai/chat/${id}`,success,"DELETE")
    return rpc.send();
  },
  generateChat : async function(data:IAiChatGenerateDef, success:(response:any)=>void,onEnd:()=>void)
  {
    const streamRpc = new StreamRpcRequest(`http://127.0.0.1:8000/ai/`,success,"POST",data,undefined,onEnd)
    streamRpc.send()
  }
}