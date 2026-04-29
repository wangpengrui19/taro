import { useMemo, useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { deckGroups } from '../data/deckGroups.js';
import { useSize } from '../hooks/useSize.js';
import { useOrbPhysics } from '../hooks/useOrbPhysics.js';
import CrystalOrbsCanvas from '../components/CrystalOrbsCanvas.jsx';

const ENTRANCE_DURATION = 1400; // ms，入场动画时长
const HANDOFF_T01 = 0.78; // 在此进度移交物理，保留残余速度

// easeOutCubic：快出慢入，模拟水晶球从角落飞出后减速落位
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// 检测WebGL是否可用
function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

export default function HomePage() {
  const navigate = useNavigate();
  const fieldRef = useRef(null);
  const size = useSize(fieldRef);
  const [webglSupported, setWebglSupported] = useState(true);

  const [entranceEase, setEntranceEase] = useState(null);
  // 入场完成后才开启物理漂移，确保物理从 home 位置以零速度出发
  const [physicsEnabled, setPhysicsEnabled] = useState(false);
  const entranceRafRef = useRef(0);
  const entranceStartedRef = useRef(false);
  const handoffVelRef = useRef(null);
  const handoffPosRef = useRef(null);

  useEffect(() => {
    setWebglSupported(isWebGLAvailable());
  }, []);

  // 5 个 home 点：四角 + 中心（major 放中心）
  const homes = useMemo(() => {
    const { w, h } = size;
    if (!w || !h) return deckGroups.map(() => ({ x: 0, y: 0 }));
    const padX = Math.max(72, w * 0.18);
    const padY = Math.max(72, h * 0.18);
    return [
      { x: w / 2, y: h / 2 - 10 }, // major —— 中心
      { x: padX, y: padY }, // wands —— 左上
      { x: w - padX, y: padY }, // cups —— 右上
      { x: padX, y: h - padY }, // pentacles —— 左下
      { x: w - padX, y: h - padY } // swords —— 右下
    ];
  }, [size.w, size.h]);

  const orderedGroups = useMemo(() => {
    const byId = Object.fromEntries(deckGroups.map((g) => [g.id, g]));
    return [byId.major, byId.wands, byId.cups, byId.pentacles, byId.swords];
  }, []);

  const radius = Math.max(42, Math.min(64, size.w * 0.12));

  // 物理漂移（入场完成后才 enabled）
  const physicsPositions = useOrbPhysics({
    homes,
    size,
    orbRadius: radius,
    enabled: physicsEnabled,
    initialPositions: handoffPosRef.current,
    initialVelocities: handoffVelRef.current
  });

  // 当 size 首次就绪时，启动入场 rAF 循环
  // rAF 在 canvas 已挂载的同一帧驱动，timing 与首帧渲染严格对齐
  useEffect(() => {
    if (size.w <= 0 || entranceStartedRef.current) return;
    entranceStartedRef.current = true;

    // 先设 ease=0，触发 canvas 挂载（orbs 在左上角）
    setEntranceEase(0);

    let startTime = null;
    const animate = (now) => {
      if (startTime === null) startTime = now;
      const t01Raw = (now - startTime) / ENTRANCE_DURATION;
      const t01 = Math.min(HANDOFF_T01, t01Raw);
      setEntranceEase(easeOutCubic(t01));
      if (t01Raw < HANDOFF_T01) {
        entranceRafRef.current = requestAnimationFrame(animate);
      } else {
        // 记录入场终止时的精确位置和残余速度，供物理引擎无缝接管
        const ease = easeOutCubic(HANDOFF_T01);
        handoffPosRef.current = homes.map((h) => ({ x: h.x * ease, y: h.y * ease }));
        const dedt = 3 * Math.pow(1 - HANDOFF_T01, 2);
        const speedPerUnit = (dedt / ENTRANCE_DURATION) * 16.67;
        handoffVelRef.current = homes.map((h) => ({
          x: h.x * speedPerUnit,
          y: h.y * speedPerUnit
        }));
        // 入场完成，交给物理引擎接管
        setPhysicsEnabled(true);
      }
    };
    entranceRafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(entranceRafRef.current);
  }, [size.w]);

  // 入场期间：按 ease 从 (0,0) 插值到 home；完成后直接用物理位置
  const displayPositions = useMemo(() => {
    if (entranceEase === null) return [];
    if (!physicsEnabled) {
      return homes.map((h) => ({ x: h.x * entranceEase, y: h.y * entranceEase }));
    }
    return physicsPositions;
  }, [entranceEase, physicsEnabled, physicsPositions, homes]);

  // canvas 在入场动画一开始就挂载（entranceEase >= 0），之后持续更新
  const orbsReady = entranceEase !== null;

  return (
    <section className="px-5 pt-10 safe-top">
      <header className="text-center mb-4">
        <h1 className="title-mystic text-2xl font-semibold text-white glow-text">
          塔罗初学之旅
        </h1>
        <p className="text-white/70 text-xs tracking-wider mt-2">
          从牌组、元素与图像开始理解韦特塔罗
        </p>
      </header>

      <div
        ref={fieldRef}
        className="relative w-full rounded-3xl overflow-hidden"
        style={{ height: 'min(70vh, 560px)' }}
      >
        {/* 氛围光背景（在 canvas 之下） */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 40%, rgba(140,109,246,0.25), transparent 60%)'
          }}
        />

        {orbsReady && (
          <CrystalOrbsCanvas
            groups={orderedGroups}
            positions={displayPositions}
            radius={radius}
            size={size}
            onSelect={(id) => navigate(`/deck/${id}`)}
          />
        )}
      </div>

      <p className="text-center text-[11px] text-white/50 mt-6 leading-relaxed">
        轻点任一水晶球进入对应牌组 · 塔罗是一面镜子，不是一句预言
      </p>
    </section>
  );
}
