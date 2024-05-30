import StarIcon from "@icon/StarIcon";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
function TextShowWin() {
  const [text, setText] = useState(`
    123
    12
    312
    3
    123
    12
    3
    12
    321
    3
    21
    3
    asdfsadf
    asdfsdaf
    `);
  const handClick = () => {
    
  }
  return (
    <div className='flex flex-col h-screen w-scrren'>
      <div className='flex-grow bg-gray-700 text-gray-100 flex flex-col'>
        <div className="flex h-full w-full items-star overflow-y-auto">
          <div className="m-5 flex-grow border-2 border-gray-500 rounded-md p-2">
            <div className="h-10">
              <p className="text-lg">Title</p>
            </div>
            <div>
              <ReactMarkdown>{text}</ReactMarkdown>
            </div>
          </div>
        </div>
        <div className="flex justify-around pb-4 flex-grow-0 flex-shrink-0 h-[30px] space-x-4  ">
          <button onClick={handClick}>
            <StarIcon />
          </button>
          <button onClick={handClick}>
          <StarIcon />
          </button>
          <button onClick={handClick}>
          <StarIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TextShowWin;
