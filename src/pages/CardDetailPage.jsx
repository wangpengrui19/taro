import { useParams, Navigate } from 'react-router-dom';
import { cardById } from '../data/cards.js';
import { groupById } from '../data/deckGroups.js';
import CardImage from '../components/CardImage.jsx';
import BackButton from '../components/BackButton.jsx';

function Section({ title, children, accent = 'rgba(255,255,255,0.2)' }) {
  return (
    <section className="glass rounded-2xl p-4 mb-3">
      <div className="flex items-center gap-2 mb-2">
        <span
          className="inline-block w-1.5 h-4 rounded-full"
          style={{ background: accent }}
        />
        <h3 className="title-mystic text-sm font-semibold text-white/95 tracking-wide">
          {title}
        </h3>
      </div>
      <div className="text-[13px] leading-relaxed text-white/85 whitespace-pre-wrap">
        {children}
      </div>
    </section>
  );
}

export default function CardDetailPage() {
  const { cardId } = useParams();
  const card = cardById[cardId];
  if (!card) return <Navigate to="/" replace />;

  const group = groupById[card.group];
  const isPlaceholder = card.uprightMeaning.startsWith('【');

  return (
    <section className="px-4 pt-4 safe-top">
      <div className="flex items-center justify-between mb-3">
        <BackButton to={`/deck/${card.group}`} label={`返回 ${group.nameZh}`} />
        <div className="text-[10px] tracking-widest text-white/50">
          {group.nameEn} · {card.nameEn}
        </div>
      </div>

      {/* 顶部牌面 */}
      <div className="flex gap-4 items-start mb-4">
        <CardImage card={card} className="w-[140px] aspect-[2/3] shrink-0" />
        <div className="min-w-0 flex-1">
          <h1 className="title-mystic text-2xl font-semibold text-white glow-text leading-tight">
            {card.nameZh}
          </h1>
          <div className="text-white/70 text-sm tracking-widest">{card.nameEn}</div>
          <div className="mt-2 text-[11px] text-white/70">
            {group.nameZh} · 元素：{card.element}
            {card.number !== undefined && card.number !== null ? ` · № ${card.number}` : ''}
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {card.keywords.map((k) => (
              <span
                key={k}
                className="text-[11px] px-2 py-0.5 rounded-full glass text-white/90"
              >
                {k}
              </span>
            ))}
          </div>
        </div>
      </div>

      {isPlaceholder && (
        <div className="mb-3 rounded-2xl border border-amber-300/30 bg-amber-500/10 px-4 py-3 text-amber-100 text-[12px] leading-relaxed">
          ✨ 本张牌的详细讲解为占位文本，可在
          <code className="mx-1 px-1 py-0.5 rounded bg-black/30 text-[11px]">
            src/data/cards.js
          </code>
          中按相同字段补全，完全不影响其它功能。
        </div>
      )}

      <Section title="正位含义" accent="rgba(255,215,130,0.8)">
        {card.uprightMeaning}
      </Section>
      <Section title="逆位含义" accent="rgba(180,140,255,0.8)">
        {card.reversedMeaning}
      </Section>
      <Section title="图像符号讲解" accent="rgba(140,200,255,0.8)">
        {card.symbolExplanation}
      </Section>
      <Section title="感情层面" accent="rgba(255,140,200,0.8)">
        {card.loveMeaning}
      </Section>
      <Section title="事业 / 学业" accent="rgba(255,180,120,0.8)">
        {card.careerMeaning}
      </Section>
      <Section title="金钱 / 现实" accent="rgba(220,220,120,0.8)">
        {card.moneyMeaning}
      </Section>

      <div
        className="glass-strong rounded-2xl p-4 mb-3"
        style={{ borderColor: 'rgba(255,255,255,0.3)' }}
      >
        <div className="text-[10px] uppercase tracking-[0.3em] text-white/60 mb-2">
          for beginners
        </div>
        <div className="title-mystic text-[15px] text-white/95 leading-relaxed">
          {card.beginnerTip}
        </div>
      </div>

      <div className="glass rounded-2xl p-4 mb-6">
        <div className="text-[10px] uppercase tracking-[0.3em] text-white/60 mb-2">
          reflection question
        </div>
        <div className="text-[14px] text-white/90 leading-relaxed">
          · {card.reflectionQuestion}
        </div>
      </div>

      <p className="text-center text-[11px] text-white/45 leading-relaxed mb-4">
        塔罗是一个"自我觉察的工具"——本解读不构成任何医疗、法律或投资建议。
      </p>
    </section>
  );
}
