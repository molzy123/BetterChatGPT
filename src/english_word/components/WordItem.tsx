// WordItem.tsx
import React from 'react';

interface WordItemProps {
  word: string;
  definition: string;
  checked: boolean;
  onToggle: () => void;
}

export const WordItem: React.FC<WordItemProps> = ({ word, definition, checked, onToggle }) => {
  return (
    <div className="flex justify-between items-center p-2 border mt-2">
      <div className='flex justify-start items-center space-x-2'>
        <div className="font-bold text-lg text-gray-100">{word}</div>
        <div className="text-sm text-gray-400">{definition}</div>
      </div>
      <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" checked={checked} onChange={onToggle} />
    </div>
  );
};
