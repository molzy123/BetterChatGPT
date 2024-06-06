import { useEffect, useRef } from "react";

export interface OptionItem {
    index: number;
    name: string;
}

export interface DropdownProps {
    options: OptionItem[];
    optionClick: (option: OptionItem) => void;
    hideDropdown: () => void;
}

const Dropdown = (props: DropdownProps) => {
    const options = props.options;
    const areaRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (areaRef.current && !areaRef.current.contains(event.target as Node)) {
                props.hideDropdown();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={`absolute right-1 mt-2 z-[99] `} ref={areaRef}>
            <div className="bg-gray-900 border-[1px] border-gray-700 rounded-md shadow-gray-700 shadow-md">
                <div className="" >
                    {options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                props.optionClick(option)
                            }}
                            className="text-gray-200 block hover:bg-gray-650 rounded-md px-4 py-2 text-sm w-full text-left"
                            role="menuitem"
                        >
                            {option.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>

    );
};

export default Dropdown;