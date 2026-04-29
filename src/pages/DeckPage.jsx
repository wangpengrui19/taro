import { useParams, Navigate } from 'react-router-dom';
import { groupById } from '../data/deckGroups.js';
import { cardsByGroup } from '../data/cards.js';
import TarotCard from '../components/TarotCard.jsx';
import BackButton from '../components/BackButton.jsx';

export default function DeckPage() {
  const { deckId } = useParams();
  const group = groupById[deckId];
  const cards = cardsByGroup[deckId];

  if (!group) return <Navigate to="/" replace />;

  return (
    <section className="px-4 pt-4 safe-top pb-6">
      <div className="flex items-center justify-between mb-4">
        <BackButton to="/" label="回到首页" />
        <div className="text-[10px] tracking-widest text-white/50">DECK · {group.nameEn}</div>
      </div>

      {/* 顶部简介 */}
      <div
        className="relative rounded-3xl p-5 overflow-hidden"
        style={{
          background: group.gradient,
          boxShadow: `0 10px 40px ${group.glowColor}`
        }}
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
        <div className="relative text-white">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full"
              style={{
                background: group.gradient,
                boxShadow: `0 0 14px ${group.glowColor}, inset -4px -5px 10px rgba(0,0,0,0.3), inset 4px 4px 10px rgba(255,255,255,0.5)`
              }}
            />
            <div>
              <h1 className="title-mystic text-xl font-semibold">{group.nameZh}</h1>
              <div className="text-[11px] opacity-80 tracking-widest">
                {group.nameEn} · 元素：{group.element} · {group.count} 张
              </div>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {group.keywords.map((k) => (
              <span
                key={k}
                className="text-[11px] px-2 py-0.5 rounded-full bg-white/20 border border-white/30"
              >
                {k}
              </span>
            ))}
          </div>
          <p className="mt-3 text-sm leading-relaxed opacity-90">{group.description}</p>
        </div>
      </div>

      {/* 卡片网格 */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {cards.map((c, i) => (
          <TarotCard key={c.id} card={c} index={i} />
        ))}
      </div>
    </section>
  );
}
