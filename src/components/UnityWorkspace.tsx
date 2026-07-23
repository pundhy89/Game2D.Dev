import React, { useState } from 'react';
import TopMenu from './TopMenu';
import TopToolbar from './TopToolbar';
import Hierarchy from './Hierarchy';
import SceneView from './SceneView';
import Inspector from './Inspector';
import ProjectWindow from './ProjectWindow';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useUnityStore } from '../store/unityStore';

export default function UnityWorkspace() {
  const { openDrawer, toggleDrawer } = useUnityStore();

  return (
    <div className="flex flex-col h-screen w-full bg-[#fdfdfd] text-gray-800 select-none text-xs font-medium relative overflow-hidden" style={{ backgroundImage: 'linear-gradient(transparent 95%, #cbd5e1 5%)', backgroundSize: '100% 24px' }}>
      {/* Red margin lines */}
      <div className="absolute top-0 bottom-0 left-12 w-[1px] bg-red-400/40 z-0 pointer-events-none"></div>
      <div className="absolute top-0 bottom-0 left-[52px] w-[1px] bg-red-400/40 z-0 pointer-events-none"></div>

      <div className="h-6 bg-white/90 backdrop-blur-sm flex items-center px-1 border-b border-gray-300 shrink-0 relative z-50">
        <TopMenu />
      </div>
      
      <TopToolbar />
      
      <div className="flex flex-1 overflow-hidden relative">
        {/* Drawer 1: Hierarchy */}
        <div 
          className={`absolute top-0 bottom-0 left-0 w-80 bg-white/95 backdrop-blur-md border-r border-gray-300 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${openDrawer === 'hierarchy' ? 'z-50' : 'z-40'} ${
            openDrawer === 'hierarchy' ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Hierarchy />
          <button 
            onClick={() => toggleDrawer('hierarchy')}
            className="absolute top-[40px] -right-6 w-6 h-28 bg-[#c45314] hover:bg-[#de5e17] border-y border-r border-[#c45314] rounded-r shadow-md flex flex-col items-center justify-center text-white transition-colors cursor-pointer"
            style={{ textOrientation: 'mixed', writingMode: 'vertical-rl' }}
            title={openDrawer === 'hierarchy' ? "Close Hierarchy" : "Open Hierarchy"}
          >
            {openDrawer === 'hierarchy' ? <ChevronLeft size={14} className="mb-1" /> : <ChevronRight size={14} className="mb-1" />}
            <span className="font-bold tracking-widest text-[9px] uppercase">Hierarchy</span>
          </button>
        </div>

        {/* Drawer 2: Inspector */}
        <div 
          className={`absolute top-0 bottom-0 left-0 w-80 bg-white/95 backdrop-blur-md border-r border-gray-300 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${openDrawer === 'inspector' ? 'z-50' : 'z-30'} ${
            openDrawer === 'inspector' ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Inspector />
          <button 
            onClick={() => toggleDrawer('inspector')}
            className="absolute top-[160px] -right-6 w-6 h-28 bg-[#1f63d6] hover:bg-[#2573f5] border-y border-r border-[#1f63d6] rounded-r shadow-md flex flex-col items-center justify-center text-white transition-colors cursor-pointer"
            style={{ textOrientation: 'mixed', writingMode: 'vertical-rl' }}
            title={openDrawer === 'inspector' ? "Close Inspector" : "Open Inspector"}
          >
            {openDrawer === 'inspector' ? <ChevronLeft size={14} className="mb-1" /> : <ChevronRight size={14} className="mb-1" />}
            <span className="font-bold tracking-widest text-[9px] uppercase">Inspector</span>
          </button>
        </div>

        {/* Drawer 3: Project */}
        <div 
          className={`absolute top-0 bottom-0 left-0 w-80 bg-white/95 backdrop-blur-md border-r border-gray-300 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${openDrawer === 'project' ? 'z-50' : 'z-20'} ${
            openDrawer === 'project' ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="h-7 bg-gray-100 flex items-center border-b border-gray-300 shrink-0">
             <div className="px-4 h-full flex items-center bg-white border-t-2 border-[#15803d] font-bold text-[#15803d]">Project</div>
          </div>
          <ProjectWindow />
          <button 
            onClick={() => toggleDrawer('project')}
            className="absolute top-[280px] -right-6 w-6 h-28 bg-[#15803d] hover:bg-[#16a34a] border-y border-r border-[#15803d] rounded-r shadow-md flex flex-col items-center justify-center text-white transition-colors cursor-pointer"
            style={{ textOrientation: 'mixed', writingMode: 'vertical-rl' }}
            title={openDrawer === 'project' ? "Close Project" : "Open Project"}
          >
            {openDrawer === 'project' ? <ChevronLeft size={14} className="mb-1" /> : <ChevronRight size={14} className="mb-1" />}
            <span className="font-bold tracking-widest text-[9px] uppercase">Project</span>
          </button>
        </div>

        {/* Drawer 4: Console */}
        <div 
          className={`absolute top-0 bottom-0 left-0 w-80 bg-white/95 backdrop-blur-md border-r border-gray-300 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${openDrawer === 'console' ? 'z-50' : 'z-10'} ${
            openDrawer === 'console' ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="h-7 bg-gray-100 flex items-center border-b border-gray-300 shrink-0">
             <div className="px-4 h-full flex items-center bg-white border-t-2 border-[#9333ea] font-bold text-[#9333ea]">Console</div>
          </div>
          <div className="flex-1 flex items-center justify-center text-gray-500">Console Output</div>
          <button 
            onClick={() => toggleDrawer('console')}
            className="absolute top-[400px] -right-6 w-6 h-28 bg-[#9333ea] hover:bg-[#a855f7] border-y border-r border-[#9333ea] rounded-r shadow-md flex flex-col items-center justify-center text-white transition-colors cursor-pointer"
            style={{ textOrientation: 'mixed', writingMode: 'vertical-rl' }}
            title={openDrawer === 'console' ? "Close Console" : "Open Console"}
          >
            {openDrawer === 'console' ? <ChevronLeft size={14} className="mb-1" /> : <ChevronRight size={14} className="mb-1" />}
            <span className="font-bold tracking-widest text-[9px] uppercase">Console</span>
          </button>
        </div>

        {/* Drawer 5: Animation */}
        <div 
          className={`absolute top-0 bottom-0 left-0 w-80 bg-white/95 backdrop-blur-md border-r border-gray-300 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${openDrawer === 'animation' ? 'z-50' : 'z-0'} ${
            openDrawer === 'animation' ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="h-7 bg-gray-100 flex items-center border-b border-gray-300 shrink-0">
             <div className="px-4 h-full flex items-center bg-white border-t-2 border-[#db2777] font-bold text-[#db2777]">Animation</div>
          </div>
          <div className="flex-1 flex items-center justify-center text-gray-500">Animation Timeline</div>
          <button 
            onClick={() => toggleDrawer('animation')}
            className="absolute top-[520px] -right-6 w-6 h-28 bg-[#db2777] hover:bg-[#ec4899] border-y border-r border-[#db2777] rounded-r shadow-md flex flex-col items-center justify-center text-white transition-colors cursor-pointer"
            style={{ textOrientation: 'mixed', writingMode: 'vertical-rl' }}
            title={openDrawer === 'animation' ? "Close Animation" : "Open Animation"}
          >
            {openDrawer === 'animation' ? <ChevronLeft size={14} className="mb-1" /> : <ChevronRight size={14} className="mb-1" />}
            <span className="font-bold tracking-widest text-[9px] uppercase">Animation</span>
          </button>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 relative z-0">
          <div className="flex-1 flex flex-col bg-transparent">
             <div className="h-7 bg-white/90 backdrop-blur-sm flex items-center shrink-0 border-b border-gray-300">
                <div className="px-4 h-full flex items-center bg-white/50 border-t-2 border-blue-500 font-bold">Scene</div>
                <div className="px-4 h-full flex items-center border-t-2 border-transparent hover:bg-gray-100/50 cursor-pointer text-gray-500">Game</div>
             </div>
             <SceneView />
          </div>
        </div>
      </div>
    </div>
  );
}
