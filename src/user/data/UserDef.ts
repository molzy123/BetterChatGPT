import { IAiBotDef } from '@src/ai/data/AIDef';


export interface UserDef
{
  id:string
  username: string,
  email: string
  password: string
}

export interface UserAllDef
{
  id:string
  username: string,
  email: string
  bots:IAiBotDef[]
}