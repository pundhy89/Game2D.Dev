import React, { useRef } from 'react';
import { useUnityStore, Asset } from '../store/unityStore';
import { Folder, Image as ImageIcon, FileText, Music, Plus, Search } from 'lucide-react';

export default function ProjectWindow() {
  const { assets, addAsset } = useUnityStore();
  const fileRef = useRef<HTMLInputElement>(null);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      const isImage = file.type.startsWith('image/');
      
      const newAsset: Asset = {
        id: `asset-${Date.now()}`,
        name: file.name,
        type: isImage ? 'image' : 'audio',
        url
      };
      
      addAsset(newAsset);
    }
  };
  
  return (
    <div className="flex-1 flex flex-col bg-transparent overflow-hidden">
      <div className="flex h-7 bg-gray-100 items-center px-2 border-b border-gray-300 justify-between shrink-0">
        <div className="flex items-center space-x-2">
          <button 
            className="flex items-center space-x-1 px-2 py-0.5 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => fileRef.current?.click()}
          >
            <Plus size={12} />
            <span>Create</span>
          </button>
          <input 
            type="file" 
            ref={fileRef} 
            className="hidden" 
            accept="image/*,audio/*"
            onChange={handleFileUpload}
          />
        </div>
        <div className="relative">
          <Search size={12} className="absolute left-1.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-white border border-gray-300 rounded-full pl-6 pr-2 py-0.5 w-40 text-gray-900 outline-none focus:border-blue-500 text-xs"
          />
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        <div className="w-48 border-r border-gray-300 overflow-y-auto py-1 shrink-0">
          <div className="flex items-center px-2 py-1 text-gray-700 hover:bg-gray-100 cursor-pointer">
            <Folder size={14} className="mr-1.5 text-blue-500 fill-blue-500/20" />
            Assets
          </div>
          <div className="flex items-center px-2 py-1 pl-6 text-gray-700 hover:bg-gray-100 cursor-pointer">
            <Folder size={14} className="mr-1.5 text-gray-400 fill-gray-400/20" />
            Scenes
          </div>
          <div className="flex items-center px-2 py-1 pl-6 text-gray-700 hover:bg-gray-100 cursor-pointer">
            <Folder size={14} className="mr-1.5 text-gray-400 fill-gray-400/20" />
            Sprites
          </div>
          <div className="flex items-center px-2 py-1 pl-6 text-gray-700 hover:bg-gray-100 cursor-pointer">
            <Folder size={14} className="mr-1.5 text-gray-400 fill-gray-400/20" />
            Scripts
          </div>
        </div>
        <div className="flex-1 p-3 overflow-y-auto flex flex-wrap gap-4 content-start">
          {assets.map(asset => (
            <div key={asset.id} className="flex flex-col items-center w-16 cursor-pointer group">
              <div className="w-16 h-16 bg-white border border-gray-300 rounded flex items-center justify-center mb-1 group-hover:border-blue-500 overflow-hidden relative transition-colors shadow-sm">
                {asset.type === 'image' ? (
                  <img src={asset.url} alt={asset.name} className="max-w-full max-h-full object-contain" />
                ) : asset.type === 'audio' ? (
                  <Music size={24} className="text-purple-500" />
                ) : (
                  <FileText size={24} className="text-gray-500" />
                )}
              </div>
              <span className="text-center truncate w-full group-hover:bg-blue-500 group-hover:text-white px-1 rounded transition-colors text-gray-800">
                {asset.name}
              </span>
            </div>
          ))}
          {assets.length === 0 && (
            <div className="w-full text-center text-gray-500 mt-4">
              Drag files here or click Create to import assets
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
