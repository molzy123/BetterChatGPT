import { ModelOptions, Role } from '../../../../BetterChatGPT/src/types/chat';


export interface IAiBotCreateDef {
  userId: string;
  name: string;
  description: string;
  config: IAiConfigDef;
}

export interface IAiBotUpdateDef {
    id:number;
    name?:string;
    description?:string;
    templateId?:string;
}

export interface IAiConfigDef {
  model: string;
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
  id: number;
  userId: string;
  name: string;
  description: string;
  config: IAiConfigDef;
  templateId?: string;
}

export interface IAiChatMessageDef {
  id?:string;
  index?:number;
  chatId?: string;
  name?: string;
  role: Role;
  content: string;
}

export interface IAiChatDef {
  id:string
  botId: string;
  name: string;
  messages: IAiChatMessageDef[];
  createTime: string;
  lastEditTime: string;
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