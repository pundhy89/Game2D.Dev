import React from 'react';
import { Hand, Move, RotateCw, Scaling, Play, Pause, StepForward } from 'lucide-react';
import { useUnityStore } from '../store/unityStore';
import { cn } from '../utils';

export default function TopToolbar() {
  const { activeTool, setActiveTool, playMode, setPlayMode } = useUnityStore();
  
  return (
    <div className="h-10 bg-white/80 backdrop-blur-sm border-b border-gray-300 flex items-center px-4 justify-between shrink-0 relative z-50">
      <div className="flex space-x-0.5">
        <button 
          onClick={() => setActiveTool('hand')}
          className={cn("p-1.5 rounded-sm transition-colors", activeTool === 'hand' ? "bg-gray-300" : "hover:bg-gray-200")}
        >
          <Hand size={16} />
        </button>
        <button 
          onClick={() => setActiveTool('translate')}
          className={cn("p-1.5 rounded-sm transition-colors", activeTool === 'translate' ? "bg-gray-300" : "hover:bg-gray-200")}
        >
          <Move size={16} />
        </button>
        <button 
          onClick={() => setActiveTool('rotate')}
          className={cn("p-1.5 rounded-sm transition-colors", activeTool === 'rotate' ? "bg-gray-300" : "hover:bg-gray-200")}
        >
          <RotateCw size={16} />
        </button>
        <button 
          onClick={() => setActiveTool('scale')}
          className={cn("p-1.5 rounded-sm transition-colors", activeTool === 'scale' ? "bg-gray-300" : "hover:bg-gray-200")}
        >
          <Scaling size={16} />
        </button>
      </div>
      
      <div className="flex space-x-1 absolute left-1/2 -translate-x-1/2">
        <button 
          onClick={() => setPlayMode(!playMode)}
          className={cn("p-1.5 rounded-sm transition-colors", playMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "hover:bg-gray-200")}
        >
          <Play size={16} className={playMode ? "fill-white" : ""} />
        </button>
        <button className="p-1.5 rounded-sm hover:bg-gray-200 transition-colors">
          <Pause size={16} />
        </button>
        <button className="p-1.5 rounded-sm hover:bg-gray-200 transition-colors">
          <StepForward size={16} />
        </button>
      </div>
      
      <div className="flex items-center space-x-2 text-xs">
        <button className="bg-gray-100 hover:bg-gray-200 transition-colors px-2 py-1 rounded border border-gray-300">Layers</button>
        <button className="bg-gray-100 hover:bg-gray-200 transition-colors px-2 py-1 rounded border border-gray-300">Layout</button>
      </div>
    </div>
  );
}
