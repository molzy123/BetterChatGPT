interface CommonTextInputProps {
  hintText: string;
  value: string;
  onChange: (value: string) => void;
  maxHeight?: number;
}

export const CommonTextInput = (data: CommonTextInputProps) => {
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
    console.log(data.maxHeight);
    
    e.target.style.maxHeight = data.maxHeight?`${data.maxHeight}px`:`${e.target.scrollHeight}px`;
  };

  const handleOnFocus = (e: React.FocusEvent<HTMLTextAreaElement, Element>) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
    e.target.style.maxHeight = data.maxHeight?`${data.maxHeight}px`:`${e.target.scrollHeight}px`;
  };

  const handleOnBlur = (e: React.FocusEvent<HTMLTextAreaElement, Element>) => {
    e.target.style.height = 'auto';
    e.target.style.maxHeight = data.maxHeight?`${data.maxHeight}px`:`2.5em`;
  }

  return (
    <div className={"flex flex-row justify-start items-center text-gray-900 dark:text-white"}>
      <div className='flex-0 min-w-[70px] max-w-[100px]  block text-sm font-medium '>
        <p>{data.hintText}</p>
      </div>
      <textarea
        className={`flex-grow my-2 mx-0 px-2 resize-none rounded-lg bg-transparent ${data.maxHeight?"overflow-y-auto":"overflow-y-hidden"}  leading-7 p-1 border border-gray-400/50 focus:ring-1 focus:ring-blue w-full max-h-10 transition-all`}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        onChange={(e) => {
          data.onChange(e.target.value);
        }}
        onInput={handleInput}
        value={data.value}
        rows={1}
      ></textarea>
    </div>
  );
};
