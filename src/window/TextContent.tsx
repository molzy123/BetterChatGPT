
import { AiChatMessage } from "@src/ai/data/AiChatMessage";

import { useBindObjectEvent } from "@src/common/Event/WeakObjectEventService";

import ReactMarkdown from "react-markdown";

function TextContent({message}:{message:AiChatMessage}) {
    useBindObjectEvent(message);
  return (
    <div className="flex h-full items-start overflow-y-auto ">
        <div className="mx-5 mb-1 flex-grow max-w-full">
        {/* <div className="h-10">
            <p className="text-lg">Title</p>
        </div> */}
        <div className="break-words">
            {message && <ReactMarkdown components={{
                pre: ({ node, ...props }) => (
                  <pre {...props} className="whitespace-pre-wrap break-words" />
                ),
                code: ({ node, ...props }) => (
                  <code {...props} className="break-words" />
                ),
              }}>{message.content}</ReactMarkdown>} 
        </div>
        </div>
    </div>
  );
}

export default TextContent;
