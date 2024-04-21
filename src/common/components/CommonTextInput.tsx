import { useTranslation } from 'react-i18next';



interface CommonTextInputProps {
  hintText: string;
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;

}

const CommonTextInput = (data:CommonTextInputerProps) => {
  const { t } = useTranslation('model');

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
    e.target.style.maxHeight = `${e.target.scrollHeight}px`;
  };

  const handleOnFocus = (e: React.FocusEvent<HTMLTextAreaElement, Element>) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
    e.target.style.maxHeight = `${e.target.scrollHeight}px`;
  };

  const handleOnBlur = (e: React.FocusEvent<HTMLTextAreaElement, Element>) => {
    e.target.style.height = 'auto';
    e.target.style.maxHeight = '2.5rem';
  };

  return (
    <div>
      <div className='block text-sm font-medium text-gray-900 dark:text-white'>
        {}
      </div>
      <textarea
        className='my-2 mx-0 px-2 resize-none rounded-lg bg-transparent overflow-y-hidden leading-7 p-1 border border-gray-400/50 focus:ring-1 focus:ring-blue w-full max-h-10 transition-all'
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        onChange={(e) => {
          _setSystemMessage(e.target.value);
        }}
        onInput={handleInput}
        value={_systemMessage}
        rows={1}
      ></textarea>
    </div>
  );
};


export default CommonTextInput;