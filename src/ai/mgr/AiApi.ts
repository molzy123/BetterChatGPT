import { handleErrorStatus } from '@utils/api';
import IAiBotCreateDef, { IAiBotDef, IAiChatDef } from '@src/ai/data/AIDef';
import { get, post } from '@src/common/utils/CommonRequest';
import { getChatCompletion } from '@api/api';
import { AiBot } from '@src/ai/data/AiBot';
import { BeanFactory } from '@src/ai/mgr/BeanFactory';
import { AiChat } from '@src/ai/data/AIChat';
import { Locator } from '@src/common/data/Locator';
import { UserService } from '@src/user/UserService';
import { BaseRpcRequest } from '@src/common/data/RPCService';
import { success } from 'concurrently/dist/src/defaults';

export const createAiBot = function(data:IAiBotCreateDef, success:(response:any)=>void)
{
  const rpc = new BaseRpcRequest("http://127.0.0.1:8000/AIChat/bot/",success,"POST",data)
  return rpc.sendRequest()
};


export const getAiBotList = async function(success:(response:any)=>void)
{

  const rpc = new BaseRpcRequest("http://127.0.0.1:8000/AIChat/bot/",success);
  return rpc.sendRequestAsync()
  // const accessToken =  Locator.fetch(UserService).accessToken;
  // const response = await get("http://127.0.0.1:8000/AIChat/bot/",accessToken);
  // if (response !== undefined) {
  //   const aiBotList:IAiBotDataBean[] = await response.json();
  //   let result:AiBot[] = []
  //   for (let iAiBotDataBean of aiBotList) {
  //     result.push(BeanFactory.createAiBot(iAiBotDataBean));
  //   }
  //   return result
  // }
}

export const getAiChatListByBotId = async function(botId:string,success:(response:any)=>void) {

  const rpc = new BaseRpcRequest(`http://127.0.0.1:8000/AIChat/Chat/${botId}`,success)
  return rpc.sendRequestAsync()

  // const response = await get(`http://127.0.0.1:8000/AIChat/Chat/${botId}`,accessToken);
  // if (response !== undefined) {
  //   const aiChatList:IAiChat[] = await response.json();
  //   let result:AiChat[] = []
  //   for (let iAiChat of aiChatList) {
  //     result.push(BeanFactory.createAiChat(iAiChat));
  //   }
  //   return result
  // }
}

export const getFirstAiChatByBotId = async function(botId:string,success:(response:any)=>void)
{

  const rpc = new BaseRpcRequest(`http://127.0.0.1:8000/AIChat/Chat/${botId}/first`,success)
  return rpc.sendRequestAsync()

  // const response = await get(`http://127.0.0.1:8000/AIChat/Chat/${botId}/first`,accessToken);
  // if (response !== undefined) {
  //   const aiChat: IAiChat = await response.json();
  //   return BeanFactory.createAiChat(aiChat);
  // }
}


export const generateTitle = async (currentChat: IAiChatDef , currentAiBot:IAiBotDef, accessToken:string): Promise<string> => {
  let data;
  try {
    // 使用自定义ApiKey
    data = await getChatCompletion(
      "http://127.0.0.1:8000/AIChat/",
      currentChat.messages,
      currentAiBot.config,
      accessToken,
    );
  } catch (error) {
    handleErrorStatus(error);
  }
  return data.choices[0].message.content; // 返回生成的标题内容
};