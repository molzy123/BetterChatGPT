import { UserDef } from '@src/user/data/UserDef';


export class User{
  id:string = ""
  username: string = ""
  email: string = ""
  disabled:  boolean = false
  password: string = ""
  ai_point: number = 0

  static fromJson(json: UserDef): User {
    const user = new User();
    user.username = json.username;
    user.email = json.email;
    user.disabled = json.disabled;
    user.password = json.password;
    user.ai_point = json.ai_point;
    return user;
  }

  public toJson(): UserDef {
    return {
      id:this.id,
      username: this.username,
      email: this.email,
      disabled: this.disabled,
      password: this.password,
      ai_point: this.ai_point
    }
  }

  constructor(){

  }
}