import StarIcon from "@icon/StarIcon";
import { AiChatMessage } from "@src/ai/data/AiChatMessage";
import { AIService } from "@src/ai/mgr/AIService";
import { useBindObjectEvent } from "@src/common/Event/WeakObjectEventService";
import { Locator } from "@src/common/data/Locator";
import { useEffect, useState } from "react";
import TextContent from "./TextContent";
import CopyIcon from "@icon/CopyIcon";
import BackIcon from "@icon/BackIcon";
import { AlertWin } from "./AlertWin";
import { AiChat } from "@src/ai/data/AIChat";
const { ipcRenderer } = window.require('electron');
function TextShowWin() {
  const [message, setMessage] = useState<AiChatMessage>();
  useEffect(() => {
    let t: string;
    ipcRenderer.on("storage", async (event, data: { channel: string, message: any }) => {
      t = data.message;
      const bot = Locator.fetch(AIService).getBotById(17);
      const chat: AiChat | undefined = await bot?.newChat();
      chat?.addMessage("user", t);
      chat?.generateChat();
      const tmp = bot?.currentChat?.getLastMessage()
      setMessage(tmp);
    });
  }, [])
  useBindObjectEvent(message);
  const onClickPin = () => {
    AlertWin.setPin(true)
  };
  return (
    <div className='flex flex-col h-screen bg-gray-900 w-scrren rounded-lg shadow-inner shadow-gray-600 border-gray-100 border-[1px]'  >
      <div className='h-full text-gray-100 flex flex-col '>
        <div className="flex flex-shrink-0 h-3 mx-10 mt-2 mb-1 rounded-md border-gray-500 shadow-inner shadow-gray-500 app-region-drag">
        </div>
        <div className="flex h-full overflow-y-auto ">
          {message && <TextContent message={message} />}
        </div>
        <div className="flex justify-around flex-grow-0 flex-shrink-0 h-[30px] space-x-4  ">
          <button>
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
        <button onClick={onClickPin} className=" p-2 bg-gray-700 text-white rounded-full shadow-lg space-y-3 hover:bg-gray-500">
          <TopPinFillIcon />
        </button>
      </div>
    </div>
  );
}

export default TextShowWin;
