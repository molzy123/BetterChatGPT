import { UserAllDef, UserDef } from '@src/user/data/UserDef';
import { IAiBotDef } from '@src/ai/data/AIDef';


export class User{
  id:string = ""
  username: string = ""
  email: string = ""
  password: string = ""
  bots: IAiBotDef[] = []

  static fromJson(json: UserAllDef): User {
    const user = new User();
    user.username = json.username;
    user.email = json.email;
    user.bots = json.bots;
    return user;
  }

  public toJson(): UserDef {
    return {
      id:this.id,
      username: this.username,
      email: this.email,
      password: this.password,
    }
  }

  constructor(){

  }
}