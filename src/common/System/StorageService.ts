export const StorageService = {

  setItem(key:string, value:any):void{
    if( typeof value === "string")
    {
      localStorage.setItem(key, value)
    }else{
      localStorage.setItem(key, JSON.stringify(value))
    }
  },

  removeItem(key:string):void{
    localStorage.removeItem(key)
  },

  getItem(key:string):string{
    return localStorage.getItem(key) || ''
  }

}