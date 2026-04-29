import { useState } from 'react';
import { groupById } from '../data/deckGroups.js';

/**
 * 统一牌面图片容器：
 * - 使用 `/cards/rws/xxx.jpg` 作为真实图片接口；
 * - 加载失败时自动降级到该元素色渐变占位（带牌名）。
 */
export default function CardImage({ card, className = '', rounded = 'rounded-2xl' }) {
  const [failed, setFailed] = useState(false);
  const group = groupById[card.group];
  const gradient = group?.gradient ?? 'linear-gradient(160deg, #4b1bba, #1a0942)';

  return (
    <div
      className={`relative overflow-hidden ${rounded} ${className}`}
      style={{
        background: failed ? gradient : '#140826',
        boxShadow: '0 12px 32px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.12)'
      }}
    >
      {!failed && (
        <img
          src={card.image}
          alt={card.nameZh}
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
      )}
      {failed && (
        <div className="absolute inset-0 flex flex-col items-center justify-between p-3 text-white">
          <div className="w-full text-right text-[10px] tracking-widest opacity-80">
            {card.number !== undefined && card.number !== null ? String(card.number).padStart(2, '0') : ''}
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 shadow-[inset_0_0_20px_rgba(255,255,255,0.4)]" />
          </div>
          <div className="w-full text-center">
            <div className="title-mystic text-sm font-semibold">{card.nameZh}</div>
            <div className="text-[10px] opacity-80 tracking-wider">{card.nameEn}</div>
          </div>
        </div>
      )}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/10 via-transparent to-black/30" />
    </div>
  );
}
