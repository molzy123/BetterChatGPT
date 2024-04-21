import React from 'react';

interface CommonToggleProps {
  label: string;
  isChecked: boolean;
  setIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
}

const CommonToggle = (data: CommonToggleProps) => {
  return (
    <label className='relative flex items-center cursor-pointer'>
      <input
        type='checkbox'
        className='sr-only peer'
        checked={data.isChecked}
        onChange={() => {
          data.setIsChecked((prev) => !prev);
        }}
      />
      <div
        className="w-9 h-5 bg-gray-200 dark:bg-gray-600 rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-green-500/70"></div>
      <span className='ml-3 text-sm font-medium text-gray-900 dark:text-gray-300'>{data.label}</span>
    </label>
  );
};