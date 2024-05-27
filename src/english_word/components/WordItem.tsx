// WordItem.tsx
import React from 'react';

interface WordItemProps {
  word: string;
  definition: string;
  checked: boolean;
  onToggle: () => void;
}



export const WordItem: React.FC<WordItemProps> = ({ word, definition, checked, onToggle }) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target instanceof HTMLInputElement) {
      // 如果点击事件的来源是 input，不执行 onToggle
      return;
    }
    onToggle();
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onToggle();
  }
  return (
    <div className="flex justify-between items-center p-2 border cursor-pointer bg-gray-900 hover:bg-gray-700 rounded-md mt-2 border-gray-500" 
      onClick={handleClick}>
      <div className='flex justify-start items-center space-x-2'>
        <div className="font-bold text-lg text-gray-300">{word}</div>
        <div className="text-sm text-gray-400">{definition}</div>
      </div>
      <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" checked={checked} onChange={handleChange} />
    </div>
  );
};
