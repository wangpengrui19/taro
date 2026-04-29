import { useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { deckGroups } from '../data/deckGroups.js';
import { useSize } from '../hooks/useSize.js';
import { useOrbPhysics } from '../hooks/useOrbPhysics.js';
import CrystalOrbsCanvas from '../components/CrystalOrbsCanvas.jsx';

export default function HomePage() {
  const navigate = useNavigate();
  const fieldRef = useRef(null);
  const size = useSize(fieldRef);

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
  const positions = useOrbPhysics({
    homes,
    size,
    orbRadius: radius,
    enabled: size.w > 0
  });

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

        {size.w > 0 && (
          <CrystalOrbsCanvas
            groups={orderedGroups}
            positions={positions}
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
