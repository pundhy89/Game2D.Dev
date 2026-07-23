import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Image as KonvaImage, Group, Transformer, Circle } from 'react-konva';
import { useUnityStore } from '../store/unityStore';
import useImage from 'use-image';

const GameObjectNode = ({ id }: { id: string }) => {
  const { gameObjects, selectedObjectId, selectObject, updateTransform } = useUnityStore();
  const go = gameObjects[id];
  const trRef = useRef<any>(null);
  const shapeRef = useRef<any>(null);
  const isSelected = selectedObjectId === id;
  
  const spriteComp = go?.components.find(c => c.type === 'SpriteRenderer');
  const [image] = useImage(spriteComp?.spriteUrl || '');

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected, image, go?.transform]);

  if (!go || !go.active) return null;
  
  const scaleMult = 100; // Unity units to pixels
  
  const x = go.parentId ? go.transform.position.x * scaleMult : go.transform.position.x * scaleMult + 400;
  const y = go.parentId ? -go.transform.position.y * scaleMult : -go.transform.position.y * scaleMult + 300;
  
  return (
    <Group
      x={x}
      y={y}
      rotation={go.transform.rotation.z}
      scaleX={go.transform.scale.x}
      scaleY={go.transform.scale.y}
      draggable={isSelected}
      onClick={(e) => {
        e.cancelBubble = true;
        selectObject(id);
      }}
      onDragEnd={(e) => {
        e.cancelBubble = true;
        if (e.target === e.currentTarget) {
          const newX = go.parentId ? e.target.x() / scaleMult : (e.target.x() - 400) / scaleMult;
          const newY = go.parentId ? -e.target.y() / scaleMult : -(e.target.y() - 300) / scaleMult;
          updateTransform(id, {
            position: { ...go.transform.position, x: newX, y: newY }
          });
        }
      }}
      onTransformEnd={(e) => {
        const node = e.target;
        updateTransform(id, {
          scale: {
            ...go.transform.scale,
            x: node.scaleX(),
            y: node.scaleY()
          },
          rotation: {
            ...go.transform.rotation,
            z: node.rotation()
          }
        });
      }}
    >
      <Group ref={shapeRef}>
        {spriteComp ? (
          image ? (
            <KonvaImage 
              image={image} 
              offsetX={image.width / 2} 
              offsetY={image.height / 2}
            />
          ) : (
            <Rect 
              width={100} 
              height={100} 
              fill={spriteComp.color || 'white'} 
              offsetX={50} 
              offsetY={50} 
            />
          )
        ) : go.components.find(c => c.type === 'Camera') ? (
          <Group>
            <Rect width={80} height={60} stroke="gray" strokeWidth={2} offsetX={40} offsetY={30} />
            <Circle radius={10} fill="rgba(128,128,128,0.2)" />
          </Group>
        ) : (
          <Circle radius={10} fill="gray" />
        )}
      </Group>
      
      {go.children.map(childId => (
        <GameObjectNode key={childId} id={childId} />
      ))}
      
      {isSelected && (
        <Transformer 
          ref={trRef} 
          boundBoxFunc={(_oldBox, newBox) => newBox}
          padding={5}
        />
      )}
    </Group>
  );
};

export default function SceneView() {
  const { rootObjects, selectObject } = useUnityStore();
  const [size, setSize] = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <div className="flex-1 bg-transparent relative overflow-hidden" ref={containerRef}>
      
      <Stage 
        width={size.width} 
        height={size.height}
        onClick={(e) => {
          if (e.target === e.target.getStage()) {
            selectObject(null);
          }
        }}
      >
        <Layer>
          {rootObjects.map(id => (
            <GameObjectNode 
              key={id} 
              id={id} 
            />
          ))}
        </Layer>
      </Stage>
      
      <div className="absolute top-2 right-2 text-gray-500 space-y-1 text-right pointer-events-none text-xs">
        <div className="font-bold">Persp</div>
        <div className="flex space-x-1 items-center justify-end">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
        </div>
      </div>
    </div>
  );
}
