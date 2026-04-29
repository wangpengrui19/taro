import { useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

// 像素坐标 → 3D 世界坐标（正交相机 zoom=1 时 1 单位 = 1 像素）
function pxToWorld(pt, w, h) {
  return [pt.x - w / 2, h / 2 - pt.y, 0];
}

// 生成彩虹 Canvas 纹理（仅 Major Arcana 使用）—— 饱和宝石色调
const RAINBOW_TEXTURE = (() => {
  if (typeof document === 'undefined') return null;
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0.0, '#ff4fa3'); // 粉红
  grad.addColorStop(0.33, '#a04cff'); // 紫
  grad.addColorStop(0.66, '#4c8aff'); // 蓝
  grad.addColorStop(1.0, '#ffbc4a'); // 金
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
})();

function Orb({ group, position, radius, onClick }) {
  const { crystal } = group;
  const isRainbow = !!crystal?.rainbow;

  const materialProps = useMemo(
    () => ({
      color: isRainbow ? '#ffffff' : crystal.tint,
      map: isRainbow ? RAINBOW_TEXTURE : null,
      roughness: 0.06,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.02,
      emissive: crystal.emissive,
      emissiveIntensity: isRainbow ? 0.22 : 0.35,
      specularIntensity: 1.25,
      reflectivity: 0.65,
      transparent: true,
      opacity: 0.48,
      depthWrite: false
    }),
    [crystal, isRainbow]
  );

  return (
    <group position={position}>
      {/* 外壳：发光 + 亮面 */}
      <mesh
        scale={radius}
        onPointerDown={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={() => {
          if (typeof document !== 'undefined') document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          if (typeof document !== 'undefined') document.body.style.cursor = '';
        }}
      >
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhysicalMaterial {...materialProps} />
      </mesh>

      {/* 球心微弱光晕：淡色、小尺寸，保留"内核"感又不挡住透明度 */}
      <mesh scale={radius * 0.42}>
        <sphereGeometry args={[1, 20, 20]} />
        <meshBasicMaterial
          color={crystal.pointLightColor}
          transparent
          opacity={0.18}
          depthWrite={false}
        />
      </mesh>

      {/* 向外投射的点光（让邻球壁上有彩色光斑） */}
      <pointLight
        color={crystal.pointLightColor}
        intensity={0.85}
        distance={radius * 5}
        decay={2}
      />
    </group>
  );
}

function SceneContent({ groups, positions, radius, onSelect }) {
  const { size } = useThree();
  const w = size.width;
  const h = size.height;

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[200, 300, 400]} intensity={0.9} />
      <directionalLight position={[-300, -100, 250]} intensity={0.45} color="#b48aff" />
      <directionalLight position={[0, -300, 300]} intensity={0.3} color="#ffd36b" />

      {groups.map((g, i) => {
        const p = positions[i];
        if (!p) return null;
        return (
          <Orb
            key={g.id}
            group={g}
            position={pxToWorld(p, w, h)}
            radius={radius}
            onClick={() => onSelect(g.id)}
          />
        );
      })}

      {groups.map((g, i) => {
        const p = positions[i];
        if (!p) return null;
        const labelPt = { x: p.x, y: p.y + radius + 20 };
        return (
          <Html
            key={g.id + '-label'}
            position={pxToWorld(labelPt, w, h)}
            center
            zIndexRange={[10, 0]}
            style={{ pointerEvents: 'none' }}
          >
            <span className="whitespace-nowrap text-center text-white drop-shadow select-none">
              <span className="block title-mystic text-sm font-semibold tracking-wide glow-text">
                {g.nameZh}
              </span>
              <span className="block text-[10px] opacity-75 tracking-[0.2em]">
                {g.nameEn}
              </span>
            </span>
          </Html>
        );
      })}
    </>
  );
}

export default function CrystalOrbsCanvas({ groups, positions, radius, onSelect }) {
  return (
    <Canvas
      orthographic
      camera={{ zoom: 1, position: [0, 0, 100] }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
        // iOS 兼容性
        preserveDrawingBuffer: true,
        stencil: false
      }}
      dpr={[1, 1.5]}
      style={{ position: 'absolute', inset: 0 }}
      // iOS PWA 兼容性：确保 canvas 正确初始化
      onCreated={({ gl }) => {
        if (gl) {
          gl.setClearColor(0x000000, 0);
        }
      }}
    >
      <SceneContent
        groups={groups}
        positions={positions}
        radius={radius}
        onSelect={onSelect}
      />
    </Canvas>
  );
}
