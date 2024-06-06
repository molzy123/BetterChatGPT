import { UserService } from "@src/user/mgr/UserService";
import { useEffect, useRef, useState } from "react";
import { Locator } from "../data/Locator";
import { useBindEvent, useBindEventRefresh } from "../Event/EventService";
import { EventEnum } from "../Event/EventEnum";
import { PopupService } from "../Popup/PopupService";
import UserLogin from "@src/user/components/UserLogin";
import Dropdown, { OptionItem } from "../components/Drapdown";


export interface TabItemData {
    index: number
    name: string
}

function Header({ tabChange }: { tabChange: (arg0: TabItemData) => void }) {
    const tabs: Array<TabItemData> = [{ index: 1, name: "Chat" }, { index: 2, name: "Info" }, { index: 3, name: "Word" }];
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const userService = Locator.fetch(UserService)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const parentRef = useRef<HTMLDivElement>(null); // 以 div 为例，根据实际情况选择元素类型

    const options = [
        { index: 1, name: 'logout' },
    ];
    const handOptionClick = (option: OptionItem) => {
        if (option.index === 1) {
            userService.logout();
        }
        setIsDrawerOpen(false);
    }


    useBindEventRefresh(EventEnum.LOGIN_STATE_CHANGE)
    const handleTabClick = ({ tab }: { tab: any }) => {
        setActiveTab(tab);
        tabChange(tab)
    };
    useEffect(() => {
        handleTabClick({ tab: tabs[0] })
    }, []);

    return (
        <header className='flex items-center justify-between w-full p-2 bg-gray-850 text-white'>
            <nav className='flex space-x-4'>
                {tabs.map((tab) => (
                    <button
                        key={tab.index}
                        className={` p-1 text-md ${activeTab.index === tab.index ? 'text-gray-300' : 'text-gray-500 hover:text-gray-300'}`}
                        onClick={() => handleTabClick({ tab: tab })}
                    >
                        {tab.name}
                    </button>
                ))}
            </nav>
            <div className='flex justify-center items-center flex-col space-x-2 cursor-pointer' onClick={() => {
                setIsDrawerOpen(true)
            }}>
                <div className="h-full">
                    <img className='w-8 h-8 rounded-full' src='https://images.unsplash.com/photo-1470429346530-f5590bff80d2?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=7200' alt='User avatar' />
                    <span>linzy</span>
                </div>
                <div className="h-0 w-0" ref={parentRef}>
                    {isDrawerOpen && <Dropdown options={options} optionClick={handOptionClick} hideDropdown={() => setIsDrawerOpen(false)} />}
                </div>
            </div>
        </header>
    );
}

export default Header;
