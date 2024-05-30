import StarIcon from "@icon/StarIcon";
import { AiChatMessage } from "@src/ai/data/AiChatMessage";
import { AIService } from "@src/ai/mgr/AIService";
import { useBindObjectEvent } from "@src/common/Event/WeakObjectEventService";
import { CacheQueueService } from "@src/common/System/CacheQueueService";
import { Locator } from "@src/common/data/Locator";
import { StorageService } from "@src/common/data/StorageService";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useLocation } from "react-router-dom";
import TextContent from "./TextContent";
const { ipcRenderer } = window.require('electron');
function TextShowWin() {

  const [message, setMessage] = useState<AiChatMessage>();
  useEffect(()=>{
    let t:string;
    ipcRenderer.on("storage", (event, data:{channel:string,message:any}) => {
      t = data.message;
      const bot = Locator.fetch(AIService).getBotById(17);
      bot?.currentChat?.addMessage("user",t);
      bot?.currentChat?.generateChat();
      const tmp = bot?.currentChat?.getLastMessage()
      setMessage(tmp);
    });    
  },[])
  useBindObjectEvent(message);
  

  const handClick = () => {
    console.log(">>>>>>>>>>>alert-pin");
    
    ipcRenderer.send("alert-pin");
  };
  return (
    <div className='flex flex-col h-screen bg-gray-900 w-scrren rounded-md border-gray-100 border-[1px]'  >
      <div className='flex-grow h-full text-gray-100 flex flex-col '>
        <div className="flex h-5 w-full app-region-drag">
        </div>
        {message && <TextContent message={message} />}
        <div className="flex justify-around flex-grow-0 flex-shrink-0 h-[30px] space-x-4  ">
          <button onClick={handClick}>
            <StarIcon />
          </button>
          <button>
          <StarIcon />
          </button>
          <button >
          <StarIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TextShowWin;
