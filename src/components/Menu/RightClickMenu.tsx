import { ContextMenuService } from '@src/common/ContextMenu/ContextMenuService';
import { Locator } from '@src/common/data/Locator';
import React from 'react';


export interface MenuItemData{
  name:string;
  action:()=>void;
}

export interface RightClickMenuProps {
    menuItemList: MenuItemData[];
}

export interface pos{
    x:number;
    y:number;
}

export const RightClickMenu = ({pos,data}:{pos:pos,data:RightClickMenuProps}) => {
  const handleRightClick = (action: ()=>void) => (e: React.MouseEvent) => {
    e.preventDefault();
    action();
    Locator.fetch(ContextMenuService).hideContextMenu();
};

    return (
      <div
        className="absolute bg-white shadow-lg rounded p-2"
        style={{ top: pos.y, left: pos.x }}
      >
        <ul>
          {data.menuItemList.map((item, index) => (
            <li key={index} onClick={handleRightClick(item.action)} className="p-2 hover:bg-gray-200 cursor-pointer">
              {item.name}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  
export default RightClickMenu;