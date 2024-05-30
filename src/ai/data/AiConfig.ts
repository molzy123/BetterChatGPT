import { ModelOptions } from '../../../../BetterChatGPT/src/types/chat';
import { IAiConfigDef } from './AIDef';

export class AiConfig {
  model: ModelOptions;
  max_tokens: number;
  temperature: number;
  top_p: number;
  presence_penalty: number;
  frequency_penalty: number;
  n: number;
  seed?: number;
  stream?: boolean;

  static fromJson(json: IAiConfigDef): AiConfig {
    return new AiConfig(json.model, json.max_tokens, json.temperature, json.top_p, json.presence_penalty, json.frequency_penalty, json.n, json.seed, json.stream);
  }

  public toJson(): IAiConfigDef {
    return {
      model: this.model,
      max_tokens: this.max_tokens,
      temperature: this.temperature,
      top_p: this.top_p,
      presence_penalty: this.presence_penalty,
      frequency_penalty: this.frequency_penalty,
      n: this.n,
      seed: this.seed,
      stream: this.stream,
    }
  }

  constructor(model: ModelOptions = 'gpt-3.5-turbo', max_tokens: number = 4096, temperature: number = 0.5, top_p: number = 1, presence_penalty: number = 0, frequency_penalty: number = 0, n: number = 1, seed?: number, stream?: boolean) {
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