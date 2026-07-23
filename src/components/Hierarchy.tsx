import React, { useState } from 'react';
import { Plus, ChevronDown, ChevronRight, Box } from 'lucide-react';
import { useUnityStore } from '../store/unityStore';
import { cn } from '../utils';

const HierarchyNode = ({ id, depth = 0 }: { id: string, depth?: number }) => {
  const { gameObjects, selectedObjectId, selectObject } = useUnityStore();
  const go = gameObjects[id];
  const [expanded, setExpanded] = useState(true);
  
  if (!go) return null;
  
  const isSelected = selectedObjectId === id;
  const hasChildren = go.children.length > 0;
  
  return (
    <div>
      <div 
        className={cn(
          "flex items-center py-1 px-1 cursor-pointer select-none",
          isSelected ? "bg-blue-500 text-white" : "hover:bg-gray-100"
        )}
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
        onClick={(e) => {
          e.stopPropagation();
          selectObject(id);
        }}
      >
        <div 
          className="w-4 h-4 flex items-center justify-center mr-1"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
        >
          {hasChildren ? (expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />) : null}
        </div>
        <Box size={14} className={cn("mr-1.5", isSelected ? "text-white" : "text-gray-500")} />
        <span className={cn("truncate", !go.active && "opacity-50")}>{go.name}</span>
      </div>
      
      {expanded && hasChildren && (
        <div>
          {go.children.map(childId => (
            <HierarchyNode key={childId} id={childId} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function Hierarchy() {
  const { rootObjects, createGameObject, selectObject } = useUnityStore();
  
  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="h-7 bg-gray-100 flex items-center px-2 justify-between border-b border-gray-300 shrink-0">
        <div className="font-bold px-2 text-[#c45314]">Hierarchy</div>
        <button 
          className="p-1 hover:bg-gray-200 rounded text-gray-600 hover:text-black"
          onClick={() => createGameObject('GameObject')}
          title="Create GameObject"
        >
          <Plus size={14} />
        </button>
      </div>
      <div 
        className="flex-1 overflow-y-auto py-1"
        onClick={() => selectObject(null)}
      >
        {rootObjects.map(id => (
          <HierarchyNode key={id} id={id} />
        ))}
      </div>
    </div>
  );
}
