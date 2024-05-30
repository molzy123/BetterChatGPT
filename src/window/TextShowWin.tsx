import { useState } from "react";

const { ipcRenderer } = window.require('electron');
function TextShowWin() {
  const [text, setText] = useState("1233333333333333333333333333333");
  const handClick = () => {
    
  }
  return (
    <div className='flex flex-col h-screen w-scrren'>
      <div className='flex-grow bg-gray-100 flex flex-col overflow-auto'>
        <p className="text-lg flex-grow">{text}</p>
        <div className="flex justify-around mt-4 flex-shrink-0 h-10 ">
          <button onClick={handClick}>1</button>
        </div>
      </div>
    </div>
  );
}

export default TextShowWin;
