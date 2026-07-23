import React, { useState, useRef, useEffect } from 'react';
import { useUnityStore } from '../store/unityStore';
import { cn } from '../utils';

const menus = {
  File: ['New Scene', 'Open Scene', '-', 'Save', 'Save As...', '-', 'Build Settings', '-', 'Exit'],
  Edit: ['Undo', 'Redo', '-', 'Cut', 'Copy', 'Paste', 'Delete', '-', 'Play', 'Pause'],
  View: ['Hierarchy', 'Inspector', 'Project', 'Console', 'Animation'],
  GameObject: ['Create Empty', 'Create Empty Child', '-', '3D Object', '2D Object', 'UI', 'Camera'],
  Component: ['Add...', '-', 'Mesh', 'Effects', 'Physics', 'Physics 2D', 'Scripts'],
  Window: ['Layouts', '-', 'Asset Store', 'Package Manager', '-', 'General', 'Sequencing'],
  Help: ['About', 'Manual', 'Scripting API']
};

export default function TopMenu() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { setPlayMode, createGameObject, deleteGameObject, selectedObjectId, toggleDrawer, openDrawer, saveScene, loadScene } = useUnityStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = (item: string) => {
    setActiveMenu(null);
    switch (item) {
      case 'Save':
        saveScene();
        break;
      case 'Open Scene':
        loadScene();
        break;
      case 'Play':
        setPlayMode(true);
        break;
      case 'Pause':
        setPlayMode(false);
        break;
      case 'Delete':
        if (selectedObjectId) deleteGameObject(selectedObjectId);
        break;
      case 'Create Empty':
        createGameObject('GameObject');
        break;
      case 'Create Empty Child':
        createGameObject('GameObject', selectedObjectId);
        break;
      case 'Hierarchy':
        toggleDrawer('hierarchy');
        break;
      case 'Inspector':
        toggleDrawer('inspector');
        break;
      case 'Project':
        toggleDrawer('project');
        break;
      case 'Console':
        toggleDrawer('console');
        break;
      case 'Animation':
        toggleDrawer('animation');
        break;
      default:
        console.log(`Clicked on ${item}`);
        break;
    }
  };

  return (
    <div className="flex space-x-0.5" ref={menuRef}>
      {Object.entries(menus).map(([name, items]) => (
        <div key={name} className="relative">
          <button
            className={cn(
              "px-2 py-0.5 rounded-sm hover:bg-gray-200/50 transition-colors focus:outline-none font-medium cursor-pointer",
              activeMenu === name && "bg-gray-200/50"
            )}
            onClick={() => setActiveMenu(activeMenu === name ? null : name)}
            onMouseEnter={() => {
              if (activeMenu && activeMenu !== name) {
                setActiveMenu(name);
              }
            }}
          >
            {name}
          </button>
          
          {activeMenu === name && (
            <div className="absolute top-full left-0 mt-0.5 w-48 bg-white border border-gray-300 shadow-xl rounded-sm py-1 z-[100] font-normal">
              {items.map((item, idx) => {
                if (item === '-') {
                  return <div key={idx} className="h-px bg-gray-200 my-1" />;
                }

                const isActiveView = ['hierarchy', 'inspector', 'project', 'console', 'animation'].includes(item.toLowerCase()) && openDrawer === item.toLowerCase();
                
                return (
                  <div 
                    key={idx}
                    className={cn(
                      "px-4 py-1.5 cursor-pointer text-xs transition-colors flex justify-between items-center",
                      isActiveView ? "bg-blue-50 text-blue-600 hover:bg-blue-100" : "text-gray-800 hover:bg-blue-500 hover:text-white"
                    )}
                    onClick={() => handleMenuClick(item)}
                  >
                    <span>{item}</span>
                    {isActiveView && <span className="text-blue-500 text-[10px]">●</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
