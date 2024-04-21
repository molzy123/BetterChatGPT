import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface CommonSliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  label?: string;
  description?: string;
}

const CommonSlider = function(data: CommonSliderProps) {
  const { t } = useTranslation('model');
  return (
    <div className='mt-5 pt-5 border-t border-gray-500'>
      {data.label && (
        <label className='block text-sm font-medium text-gray-900 dark:text-white'>
          {data.label } {data.value}
        </label>
      )}

      <input id='default-range' type='range' value={data.value} onChange={(e) => {
        data.onChange(Number(e.target.value));
      }}
             min={data.min}
             max={data.max}
             step={data.step}
             className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
      />

      {data.description && (
        <div className='min-w-fit text-gray-500 dark:text-gray-300 text-sm mt-2'>
          {data.description}
        </div>
      )}
    </div>
  );
};

export default CommonSlider;