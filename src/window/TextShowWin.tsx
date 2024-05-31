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
import CopyIcon from "@icon/CopyIcon";
import TopPinIcon, { TopPinFillIcon } from "@icon/TopPinIcon";
import BackIcon from "@icon/BackIcon";
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
    ipcRenderer.send("alert-pin");
  };
  return (
    <div className='flex flex-col h-screen bg-gray-900 w-scrren rounded-lg shadow-inner shadow-gray-600 border-gray-100 border-[1px]'  >
      <div className='flex-grow h-full text-gray-100 flex flex-col '>
        <div className="flex h-4 mx-10 mt-2 rounded-md border-gray-500 shadow-inner shadow-gray-500 app-region-drag">
        </div>
        <div className="flex h-full">
          {message && <TextContent message={message} />}
        </div>
        <div className="flex justify-around flex-grow-0 flex-shrink-0 h-[30px] space-x-4  ">
          <button onClick={handClick}>
            <BackIcon className="w-7 h-7" />
          </button>
          <button>
          <CopyIcon />
          </button>
          <button >
          <StarIcon />
          </button>
          
         
          
        </div>
      </div>
      <div className="absolute flex flex-col top-8 left-2 space-y-2">
        <button className=" p-2 bg-gray-700 text-white rounded-full shadow-lg space-y-3 hover:bg-gray-500">
        <TopPinFillIcon />
        </button>
      </div>
    </div>
  );
}

export default TextShowWin;
