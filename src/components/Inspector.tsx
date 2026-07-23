import React, { useState } from 'react';
import { useUnityStore } from '../store/unityStore';
import { Settings, Trash2, Box, Image as ImageIcon, ChevronDown } from 'lucide-react';
import { cn } from '../utils';

const TransformField = ({ label, value, onChange }: { label: string, value: any, onChange: (val: any) => void }) => {
  return (
    <div className="flex items-center mb-1">
      <div className="w-16 text-gray-400 text-xs">{label}</div>
      <div className="flex flex-1 space-x-1">
        <div className="flex flex-1 bg-white rounded border border-gray-300 overflow-hidden focus-within:border-blue-500">
          <span className="px-1 text-gray-500 bg-gray-100 border-r border-gray-300">X</span>
          <input 
            type="number" 
            value={value.x} 
            onChange={e => onChange({ ...value, x: Number(e.target.value) })}
            className="w-full bg-transparent text-gray-900 px-1 outline-none text-xs min-w-0"
          />
        </div>
        <div className="flex flex-1 bg-white rounded border border-gray-300 overflow-hidden focus-within:border-blue-500">
          <span className="px-1 text-gray-500 bg-gray-100 border-r border-gray-300">Y</span>
          <input 
            type="number" 
            value={value.y} 
            onChange={e => onChange({ ...value, y: Number(e.target.value) })}
            className="w-full bg-transparent text-gray-900 px-1 outline-none text-xs min-w-0"
          />
        </div>
        <div className="flex flex-1 bg-white rounded border border-gray-300 overflow-hidden focus-within:border-blue-500">
          <span className="px-1 text-gray-500 bg-gray-100 border-r border-gray-300">Z</span>
          <input 
            type="number" 
            value={value.z} 
            onChange={e => onChange({ ...value, z: Number(e.target.value) })}
            className="w-full bg-transparent text-gray-900 px-1 outline-none text-xs min-w-0"
          />
        </div>
      </div>
    </div>
  );
}

export default function Inspector() {
  const { gameObjects, selectedObjectId, updateGameObject, updateTransform, updateComponent, removeComponent, addComponent, deleteGameObject } = useUnityStore();
  const [showAddComponent, setShowAddComponent] = useState(false);
  
  if (!selectedObjectId || !gameObjects[selectedObjectId]) {
    return (
      <div className="flex flex-col h-full bg-transparent">
        <div className="h-7 bg-gray-100 flex items-center px-4 font-bold border-b border-gray-300 text-xs shrink-0 text-[#1f63d6]">
          Inspector
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-500">
          No object selected
        </div>
      </div>
    );
  }
  
  const go = gameObjects[selectedObjectId];
  
  return (
    <div className="flex flex-col h-full bg-transparent overflow-y-auto">
      <div className="h-7 bg-gray-100 flex items-center px-4 justify-between font-bold border-b border-gray-300 sticky top-0 z-10 shrink-0 text-xs text-[#1f63d6]">
        <div>Inspector</div>
        <button onClick={() => deleteGameObject(go.id)} className="text-gray-500 hover:text-red-500 transition-colors" title="Delete GameObject">
          <Trash2 size={14} />
        </button>
      </div>
      
      <div className="p-3 border-b border-gray-300">
        <div className="flex items-center space-x-2 mb-3">
          <input 
            type="checkbox" 
            checked={go.active} 
            onChange={e => updateGameObject(go.id, { active: e.target.checked })}
            className="accent-blue-500 rounded-sm w-4 h-4 cursor-pointer"
          />
          <input 
            type="text" 
            value={go.name}
            onChange={e => updateGameObject(go.id, { name: e.target.value })}
            className="flex-1 bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:border-blue-500 text-gray-900 font-semibold text-sm"
          />
        </div>
        
        <div className="flex items-center space-x-4 text-gray-600 mb-2">
          <div className="flex items-center space-x-1">
            <span>Tag</span>
            <select className="bg-white border border-gray-300 rounded px-1 outline-none text-gray-900 py-0.5">
              <option>Untagged</option>
              <option>Player</option>
              <option>Enemy</option>
            </select>
          </div>
          <div className="flex items-center space-x-1">
            <span>Layer</span>
            <select className="bg-white border border-gray-300 rounded px-1 outline-none text-gray-900 py-0.5">
              <option>Default</option>
              <option>UI</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="border-b border-gray-300">
        <div className="px-3 py-1.5 bg-gray-200 font-bold flex items-center shadow-sm cursor-pointer select-none text-gray-800">
          <div className="w-4 h-4 mr-1 flex items-center justify-center"><ChevronDown size={14} /></div>
          Transform
        </div>
        <div className="p-3">
          <TransformField 
            label="Position" 
            value={go.transform.position} 
            onChange={val => updateTransform(go.id, { position: val })} 
          />
          <TransformField 
            label="Rotation" 
            value={go.transform.rotation} 
            onChange={val => updateTransform(go.id, { rotation: val })} 
          />
          <TransformField 
            label="Scale" 
            value={go.transform.scale} 
            onChange={val => updateTransform(go.id, { scale: val })} 
          />
        </div>
      </div>
      
      {go.components.map((comp) => (
        <div key={comp.id} className="border-b border-gray-300">
          <div className="px-3 py-1.5 bg-gray-200 font-bold flex items-center justify-between shadow-sm group select-none text-gray-800">
            <div className="flex items-center">
              <div className="w-4 h-4 mr-1 flex items-center justify-center"><ChevronDown size={14} /></div>
              {comp.type === 'SpriteRenderer' && <ImageIcon size={14} className="mr-1.5 text-green-600" />}
              {comp.type === 'Camera' && <Box size={14} className="mr-1.5 text-blue-600" />}
              {comp.type}
            </div>
            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => removeComponent(go.id, comp.id)} className="p-1 hover:bg-gray-300 rounded text-gray-600">
                <Settings size={12} />
              </button>
            </div>
          </div>
          <div className="p-3">
            {Object.keys(comp).filter(k => k !== 'id' && k !== 'type').map(key => (
              <div key={key} className="flex items-center mb-1.5">
                <div className="w-1/3 text-gray-400 capitalize truncate pr-2">{key}</div>
                <div className="w-2/3 flex items-center">
                  {typeof comp[key] === 'boolean' ? (
                    <input 
                      type="checkbox" 
                      checked={comp[key]}
                      onChange={e => updateComponent(go.id, comp.id, { [key]: e.target.checked })}
                      className="accent-blue-500 w-4 h-4 cursor-pointer"
                    />
                  ) : typeof comp[key] === 'string' && key.toLowerCase().includes('color') ? (
                    <div className="flex items-center space-x-2 w-full">
                      <input 
                        type="color" 
                        value={comp[key]}
                        onChange={e => updateComponent(go.id, comp.id, { [key]: e.target.value })}
                        className="w-8 h-5 bg-transparent p-0 border-0 cursor-pointer shrink-0"
                      />
                      <input 
                        type="text" 
                        value={comp[key]}
                        onChange={e => updateComponent(go.id, comp.id, { [key]: e.target.value })}
                        className="flex-1 bg-white border border-gray-300 rounded px-1.5 py-0.5 text-gray-900 outline-none focus:border-blue-500 min-w-0"
                      />
                    </div>
                  ) : (
                    <input 
                      type="text" 
                      value={typeof comp[key] === 'object' ? JSON.stringify(comp[key]) : comp[key]}
                      onChange={e => {
                        let val: any = e.target.value;
                        if (!isNaN(Number(val)) && val !== '') val = Number(val);
                        updateComponent(go.id, comp.id, { [key]: val })
                      }}
                      className="w-full bg-white border border-gray-300 rounded px-1.5 py-0.5 text-gray-900 outline-none focus:border-blue-500 min-w-0"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      <div className="p-4 flex justify-center pb-8">
        <div className="relative w-full">
          <button 
            className="w-full bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-800 rounded px-4 py-1.5 font-bold shadow-sm transition-colors"
            onClick={() => setShowAddComponent(!showAddComponent)}
          >
            Add Component
          </button>
          
          {showAddComponent && (
            <div className="absolute bottom-full mb-1 left-0 w-full bg-white border border-gray-300 rounded shadow-xl overflow-hidden z-50">
              <div className="p-1 border-b border-gray-300">
                <input type="text" placeholder="Search..." className="w-full bg-gray-100 px-2 py-1 rounded text-gray-900 outline-none border border-gray-300" />
              </div>
              <div className="max-h-48 overflow-y-auto py-1">
                {['SpriteRenderer', 'BoxCollider2D', 'Rigidbody2D', 'AudioSource'].map(type => (
                  <button 
                    key={type}
                    className="w-full text-left px-3 py-1.5 hover:bg-blue-500 hover:text-white text-gray-700 transition-colors"
                    onClick={() => {
                      addComponent(go.id, type);
                      setShowAddComponent(false);
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
