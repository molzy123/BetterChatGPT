
import { code, p } from "@src/ai/components/message/view/ContentView";
import { AiChatMessage } from "@src/ai/data/AiChatMessage";

import { useBindObjectEvent } from "@src/common/Event/WeakObjectEventService";

import ReactMarkdown from "react-markdown";

function TextContent({ message }: { message: AiChatMessage }) {
  useBindObjectEvent(message);
  return (
    <div className="flex items-start h-full ">
      <div className="mx-5 mb-1 h-full max-w-full">
        {/* <div className="h-10">
            <p className="text-lg">Title</p>
        </div> */}
        <div className="break-words">
          {message && <ReactMarkdown components={{

          }}>{message.content}</ReactMarkdown>}
        </div>
      </div>
    </div>
  );
}

export default TextContent;
