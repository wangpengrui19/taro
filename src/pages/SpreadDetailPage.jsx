import { useParams, Navigate } from 'react-router-dom';
import { spreadById } from '../data/spreads.js';
import BackButton from '../components/BackButton.jsx';

// 放大的牌位示意图
function LayoutDiagram({ positions }) {
  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl glass overflow-hidden">
      {/* 背景点阵装饰 */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          background:
            'radial-gradient(1px 1px at 25% 25%, rgba(255,255,255,0.4), transparent 60%), radial-gradient(1px 1px at 75% 75%, rgba(255,255,255,0.4), transparent 60%)',
          backgroundSize: '40px 40px'
        }}
      />
      {positions.map((p) => (
        <div
          key={p.index}
          className="absolute flex flex-col items-center gap-1"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div
            className="w-10 h-14 rounded-md bg-white/85 text-nebula-900 flex items-center justify-center text-[10px] font-bold shadow-lg"
            style={{
              transform: p.rotated ? 'rotate(90deg)' : undefined,
              boxShadow: '0 6px 16px rgba(0,0,0,0.4)'
            }}
          >
            {p.index + 1}
          </div>
          <div className="text-[10px] text-white/85 whitespace-nowrap">{p.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function SpreadDetailPage() {
  const { spreadId } = useParams();
  const spread = spreadById[spreadId];
  if (!spread) return <Navigate to="/spreads" replace />;

  return (
    <section className="px-4 pt-4 safe-top">
      <div className="flex items-center justify-between mb-3">
        <BackButton to="/spreads" label="返回牌阵" />
        <div className="text-[10px] tracking-widest text-white/50">{spread.nameEn}</div>
      </div>

      <header className="mb-4">
        <h1 className="title-mystic text-2xl font-semibold text-white glow-text">
          {spread.nameZh}
        </h1>
        <div className="text-[11px] text-white/60 tracking-widest mt-1">
          {spread.nameEn} · {spread.cardCount} 张
        </div>
        <p className="mt-3 text-[13px] text-white/85 leading-relaxed">{spread.description}</p>
      </header>

      <h2 className="text-[11px] tracking-[0.25em] text-white/60 mb-2">牌位示意</h2>
      <LayoutDiagram positions={spread.positions} />

      <h2 className="text-[11px] tracking-[0.25em] text-white/60 mt-5 mb-2">每个位置</h2>
      <div className="space-y-2">
        {spread.positions.map((p) => (
          <div key={p.index} className="glass rounded-2xl p-3 flex gap-3 items-start">
            <div className="w-8 h-8 shrink-0 rounded-full glass-strong flex items-center justify-center title-mystic text-white text-sm">
              {p.index + 1}
            </div>
            <div>
              <div className="text-white font-medium text-[13px]">{p.label}</div>
              <div className="text-white/75 text-[12px] leading-relaxed">{p.meaning}</div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-[11px] tracking-[0.25em] text-white/60 mt-5 mb-2">适合的问题</h2>
      <div className="glass rounded-2xl p-3">
        <ul className="list-disc list-inside space-y-1 text-[13px] text-white/85 leading-relaxed">
          {spread.suitableQuestions.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
      </div>

      <div className="mt-5 glass-strong rounded-2xl p-4">
        <div className="text-[10px] uppercase tracking-[0.3em] text-white/60 mb-2">
          for beginners
        </div>
        <div className="title-mystic text-[15px] text-white leading-relaxed">
          {spread.beginnerTip}
        </div>
      </div>

      <p className="text-center text-[11px] text-white/45 mt-5 mb-4 leading-relaxed">
        牌阵帮你"提问"，而不是替你"决定"。每一次读牌，都是和自己的一次对话。
      </p>
    </section>
  );
}
