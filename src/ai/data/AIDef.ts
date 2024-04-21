import { message } from '@components/Chat/ChatContent/Message';
import { ModelOptions, Role } from '../../../../BetterChatGPT/src/types/chat';


export interface IAiBotCreateDef {
  user_id: string;
  name: string;
  summary: string;
  config: IAiConfigDef;
}

export interface IAiConfigDef {
  model: ModelOptions;
  max_tokens: number;
  temperature: number;
  top_p: number;
  presence_penalty: number;
  frequency_penalty: number;
  n: number;
  seed?: number;
  stream?: boolean;
}


export interface IAiBotDef {
  id: string;
  user_id: string;
  name: string;
  summary: string;
  config: IAiConfigDef;
}

export interface IAiChatMessageDef {
  name?: string;
  role: Role;
  content: string;
}

export interface IAiChatDef {
  id:string
  ai_bot_id: string;
  chat_title: string;
  messages: IAiChatMessageDef[];
  start_time: string;
  end_time: string;
}

export interface IAiChatGenerateDef extends IAiConfigDef {
  messages: IAiChatMessageDef[];
}

export interface IAiChatGenerateResponseDef {
  id:string
  choices:[{
    finish_reason: string
    index: number
    message:{
      content?:string
      tools_calls?:[
        {
          id:string
          type:string
          function:{
            name:string
            arguments:string
          }
        }
      ]
      role:string

    }
    logprobs?:{
      content?:[{
        token: string
        logprob: number
        bytes?:[]
        top_logprobs?:[{
          token: string
          logprob: number
          bytes?:[]
        }]
      }]
    }
  }]
  created: number
  model: string
  system_fingerprint?: string
  object:string
  usage?: {
    completion_tokens: number
    prompt_tokens: number
    total_tokens: number
  }
}

export interface IAiChatGenerateChunkDef{
  id:string
  choices:[{
    finish_reason: string
    index: number
    delta:{
      content?:string
      tools_calls?:[
        {
          id:string
          type:string
          function:{
            name:string
            arguments:string
          }
        }
      ]
      role:string
    }
    logprobs?:{
      content?:[{
        token: string
        logprob: number
        bytes?:[]
        top_logprobs?:[{
          token: string
          logprob: number
          bytes?:[]
        }]
      }]
    }
  }]
  created: number
  model: string
  system_fingerprint?: string
  object:string
}

export default IAiBotCreateDef;