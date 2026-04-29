import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { spreads } from '../data/spreads.js';

// 一个迷你可视化：在 12x12 的小方格里画出 position 的点分布
function MiniLayout({ positions }) {
  return (
    <div className="relative w-full aspect-[16/9] rounded-xl bg-white/5 border border-white/10 overflow-hidden">
      {positions.map((p) => (
        <span
          key={p.index}
          className="absolute rounded-sm bg-white/70"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: 14,
            height: 20,
            transform: `translate(-50%, -50%) ${p.rotated ? 'rotate(90deg)' : ''}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
          }}
        />
      ))}
    </div>
  );
}

export default function SpreadsPage() {
  return (
    <section className="px-4 pt-6 safe-top">
      <header className="text-center mb-5">
        <h1 className="title-mystic text-xl font-semibold text-white glow-text">牌阵讲解</h1>
        <p className="text-white/65 text-[12px] mt-1 leading-relaxed max-w-sm mx-auto">
          牌阵是一种"提问框架"——它帮你把一个大问题拆解成几个可以倾听的角度。
        </p>
      </header>

      <div className="grid grid-cols-1 gap-3">
        {spreads.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to={`/spreads/${s.id}`}
              className="block glass rounded-2xl p-4 active:scale-[0.99] transition-transform"
            >
              <div className="flex items-start gap-4">
                <div className="w-28 shrink-0">
                  <MiniLayout positions={s.positions} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <h2 className="title-mystic text-white font-semibold text-[15px]">
                      {s.nameZh}
                    </h2>
                    <span className="text-[10px] text-white/50 tracking-widest">
                      {s.cardCount} 张
                    </span>
                  </div>
                  <div className="text-[10px] text-white/50 tracking-widest mb-1">
                    {s.nameEn}
                  </div>
                  <p className="text-[12px] text-white/80 leading-relaxed line-clamp-3">
                    {s.description}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
