import { Locator } from '@src/common/System/Locator';
import { UserService } from '@src/user/mgr/UserService';
import useStore from '@store/store';
import { isNumber } from 'lodash';

export const isAzureEndpoint = (endpoint: string) => {
  return endpoint.includes('openai.azure.com');
};

export type errorType = {
  status:number,
  detail:string
}



export const handleErrorStatus = (errorArg:any) => {
  console.log(errorArg);
  const errorStr = errorArg
  console.log(errorStr);
  if(typeof errorStr === 'string') {
    let error:errorType = JSON.parse(errorStr)
    const status = error.status
    let text = error.detail
    if (status === 404 || status === 405) {
      if (text.includes('model_not_found')) {
        text + '\nMessage from Better ChatGPT:\nPlease ensure that you have access to the GPT-4 API!'
      } else {
        text += 'Message from Better ChatGPT:\nInvalid API endpoint! We recommend you to check your free API endpoint.'
      }
    }else if (status === 401) {
      Locator.fetch(UserService).logout()
      if(text.includes('expired')){
        text = "身份验证已过期"
      }else if(text.includes("Could not validate credentials")){
        text = "无法验证凭据"
      }else if(text.includes("Incorrect username or password")) {
        text ="用户名或密码错误"
      }
    }else if(status === 429) {
      text += '\nRate limited!';
    }else if(text.includes('insufficient_quota')){
      text += '\nMessage from Better ChatGPT:\nWe recommend changing your API endpoint or API key';
    }else if(status == 402 && text.includes("not enough")){
      text = "次数不够！"
    }
    useStore.getState().setError(text);
  }
}

export const getClientError = (message: string):string => {
  let error = {
    status : 0,
    detail : "No messages submitted!"
  }
  return JSON.stringify(error);
}