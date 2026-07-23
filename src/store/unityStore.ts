import { create } from 'zustand';

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Component {
  id: string;
  type: string;
  [key: string]: any;
}

export interface GameObject {
  id: string;
  name: string;
  active: boolean;
  transform: {
    position: Vector3;
    rotation: Vector3;
    scale: Vector3;
  };
  components: Component[];
  parentId: string | null;
  children: string[];
}

export interface Asset {
  id: string;
  name: string;
  type: string;
  url: string;
}

interface UnityState {
  gameObjects: Record<string, GameObject>;
  rootObjects: string[];
  selectedObjectId: string | null;
  assets: Asset[];
  playMode: boolean;
  activeTool: 'hand' | 'translate' | 'rotate' | 'scale';
  openDrawer: string | null;
  
  createGameObject: (name: string, parentId?: string | null) => void;
  updateGameObject: (id: string, updates: Partial<GameObject>) => void;
  updateTransform: (id: string, transform: Partial<GameObject['transform']>) => void;
  deleteGameObject: (id: string) => void;
  selectObject: (id: string | null) => void;
  setPlayMode: (play: boolean) => void;
  setActiveTool: (tool: 'hand' | 'translate' | 'rotate' | 'scale') => void;
  setOpenDrawer: (drawer: string | null) => void;
  toggleDrawer: (drawer: string) => void;
  addComponent: (goId: string, type: string) => void;
  updateComponent: (goId: string, compId: string, updates: any) => void;
  removeComponent: (goId: string, compId: string) => void;
  addAsset: (asset: Asset) => void;
  saveScene: () => void;
  loadScene: () => void;
}

export const useUnityStore = create<UnityState>((set) => ({
  gameObjects: {
    'main-camera': {
      id: 'main-camera',
      name: 'Main Camera',
      active: true,
      transform: { position: { x: 0, y: 0, z: -10 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      components: [{ id: 'comp-cam', type: 'Camera', clearColor: '#314D79', orthographic: true, size: 5 }],
      parentId: null,
      children: []
    },
    'directional-light': {
      id: 'directional-light',
      name: 'Directional Light',
      active: true,
      transform: { position: { x: 0, y: 3, z: 0 }, rotation: { x: 50, y: -30, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      components: [{ id: 'comp-light', type: 'Light', lightType: 'Directional', color: '#ffffff', intensity: 1 }],
      parentId: null,
      children: []
    },
    'player': {
      id: 'player',
      name: 'Player',
      active: true,
      transform: { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      components: [{ id: 'comp-sprite', type: 'SpriteRenderer', color: '#ff0000', spriteUrl: '' }],
      parentId: null,
      children: []
    }
  },
  rootObjects: ['main-camera', 'directional-light', 'player'],
  selectedObjectId: 'player',
  assets: [],
  playMode: false,
  activeTool: 'translate',
  openDrawer: null,
  
  createGameObject: (name, parentId = null) => set((state) => {
    const id = `go-${Date.now()}`;
    const newGo: GameObject = {
      id,
      name,
      active: true,
      transform: { position: { x: 0, y: 0, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, scale: { x: 1, y: 1, z: 1 } },
      components: [],
      parentId,
      children: []
    };
    
    const gameObjects = { ...state.gameObjects, [id]: newGo };
    const rootObjects = [...state.rootObjects];
    
    if (parentId && gameObjects[parentId]) {
      gameObjects[parentId] = {
        ...gameObjects[parentId],
        children: [...gameObjects[parentId].children, id]
      };
    } else {
      rootObjects.push(id);
    }
    
    return { gameObjects, rootObjects, selectedObjectId: id };
  }),
  
  updateGameObject: (id, updates) => set((state) => {
    if (!state.gameObjects[id]) return state;
    return {
      gameObjects: {
        ...state.gameObjects,
        [id]: { ...state.gameObjects[id], ...updates }
      }
    };
  }),
  
  updateTransform: (id, transform) => set((state) => {
    if (!state.gameObjects[id]) return state;
    return {
      gameObjects: {
        ...state.gameObjects,
        [id]: { 
          ...state.gameObjects[id], 
          transform: { ...state.gameObjects[id].transform, ...transform } 
        }
      }
    };
  }),
  
  deleteGameObject: (id) => set((state) => {
    const gameObjects = { ...state.gameObjects };
    const go = gameObjects[id];
    if (!go) return state;
    
    const deleteRecursive = (objId: string) => {
      const obj = gameObjects[objId];
      if (obj) {
        obj.children.forEach(deleteRecursive);
        delete gameObjects[objId];
      }
    };
    
    deleteRecursive(id);
    
    let rootObjects = state.rootObjects.filter(rid => rid !== id);
    if (go.parentId && gameObjects[go.parentId]) {
      gameObjects[go.parentId] = {
        ...gameObjects[go.parentId],
        children: gameObjects[go.parentId].children.filter(cid => cid !== id)
      };
    }
    
    return { 
      gameObjects, 
      rootObjects,
      selectedObjectId: state.selectedObjectId === id ? null : state.selectedObjectId
    };
  }),
  
  selectObject: (id) => set({ selectedObjectId: id }),
  setPlayMode: (play) => set({ playMode: play }),
  setActiveTool: (tool) => set({ activeTool: tool }),
  setOpenDrawer: (drawer) => set({ openDrawer: drawer }),
  toggleDrawer: (drawer) => set((state) => ({ openDrawer: state.openDrawer === drawer ? null : drawer })),
  
  addComponent: (goId, type) => set((state) => {
    const go = state.gameObjects[goId];
    if (!go) return state;
    const newComp: Component = { id: `comp-${Date.now()}`, type };
    if (type === 'SpriteRenderer') {
      newComp.spriteUrl = '';
      newComp.color = '#ffffff';
    } else if (type === 'BoxCollider2D') {
      newComp.size = { x: 1, y: 1 };
      newComp.offset = { x: 0, y: 0 };
    }
    return {
      gameObjects: {
        ...state.gameObjects,
        [goId]: { ...go, components: [...go.components, newComp] }
      }
    };
  }),
  
  updateComponent: (goId, compId, updates) => set((state) => {
    const go = state.gameObjects[goId];
    if (!go) return state;
    return {
      gameObjects: {
        ...state.gameObjects,
        [goId]: {
          ...go,
          components: go.components.map(c => c.id === compId ? { ...c, ...updates } : c)
        }
      }
    };
  }),
  
  removeComponent: (goId, compId) => set((state) => {
    const go = state.gameObjects[goId];
    if (!go) return state;
    return {
      gameObjects: {
        ...state.gameObjects,
        [goId]: {
          ...go,
          components: go.components.filter(c => c.id !== compId)
        }
      }
    };
  }),
  
  addAsset: (asset) => set((state) => ({ assets: [...state.assets, asset] })),
  
  saveScene: () => set((state) => {
    try {
      const sceneData = {
        gameObjects: state.gameObjects,
        rootObjects: state.rootObjects,
      };
      localStorage.setItem('unity_scene_save', JSON.stringify(sceneData));
      alert('Scene saved successfully!');
    } catch (err) {
      console.error('Failed to save scene:', err);
      alert('Failed to save scene.');
    }
    return state;
  }),
  
  loadScene: () => set((state) => {
    try {
      const dataStr = localStorage.getItem('unity_scene_save');
      if (dataStr) {
        const data = JSON.stringify(dataStr) ? JSON.parse(dataStr) : null;
        if (data && data.gameObjects && data.rootObjects) {
          alert('Scene loaded successfully!');
          return {
            gameObjects: data.gameObjects,
            rootObjects: data.rootObjects,
            selectedObjectId: null
          };
        }
      }
      alert('No saved scene found.');
    } catch (err) {
      console.error('Failed to load scene:', err);
      alert('Failed to load scene.');
    }
    return state;
  })
}));
