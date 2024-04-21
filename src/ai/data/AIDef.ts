import { ModelOptions, Role } from '@type/chat';


export interface IAiBotCreateBean {
  user_id: string;
  name: string;
  summary: string;
  config: IAiConfigBean;
}

export interface IAiConfigBean {
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


export interface IAiBotDataBean {
  id: string;
  user_id: string;
  name: string;
  summary: string;
  config: IAiConfigBean;
}

export interface IAiChatMessage {
  index?: number;
  name?: string;
  role: Role;
  content: string;
}

export interface IAiChat {
  id:string
  ai_bot_id: string;
  chat_title: string;
  messages: IAiChatMessage[];
  start_time: string;
  end_time: string;
}

export class AiConfig implements IAiConfigBean {
  model: ModelOptions;
  max_tokens: number;
  temperature: number;
  top_p: number;
  presence_penalty: number;
  frequency_penalty: number;
  n: number;
  seed?: number;
  stream?: boolean;

  constructor(model: ModelOptions = 'gpt-3.5-turbo', max_tokens: number = 4096, temperature: number = 0.5, top_p: number = 1, presence_penalty: number = 0, frequency_penalty: number = 0, n: number = 16, seed?: number, stream?: boolean) {
    this.model = model;
    this.max_tokens = max_tokens;
    this.temperature = temperature;
    this.top_p = top_p;
    this.presence_penalty = presence_penalty;
    this.frequency_penalty = frequency_penalty;
    this.n = n;
    this.seed = seed;
    this.stream = stream;
  }
}


export class AiBotCreate implements IAiBotCreateBean {
  user_id: string = "";
  name: string;
  summary: string;
  config: IAiConfigBean;

  constructor(name: string = "机器人", summary: string = "", config: IAiConfigBean = new AiConfig()) {
    this.name = name;
    this.summary = summary;
    this.config = config;
  }
}

export default IAiBotCreateBean;