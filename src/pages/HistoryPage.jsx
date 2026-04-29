import { motion } from 'framer-motion';
import { historyTimeline } from '../data/historyTimeline.js';

export default function HistoryPage() {
  return (
    <section className="px-5 pt-6 safe-top">
      <header className="text-center mb-6">
        <h1 className="title-mystic text-xl font-semibold text-white glow-text">塔罗小史</h1>
        <p className="text-white/65 text-[12px] mt-1 leading-relaxed max-w-sm mx-auto">
          它不是从一开始就神秘——塔罗是一条慢慢被添上故事的路。
        </p>
      </header>

      {/* 时间线 */}
      <div className="relative pl-8">
        {/* 竖线 */}
        <span
          aria-hidden
          className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-white/5 via-white/30 to-white/5"
        />
        <div className="space-y-4">
          {historyTimeline.map((node, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="relative glass rounded-2xl p-4"
            >
              {/* 节点小圆点 */}
              <span
                className="absolute -left-[22px] top-5 w-3 h-3 rounded-full bg-white"
                style={{ boxShadow: '0 0 12px rgba(200,180,255,0.9)' }}
              />
              <div className="text-[10px] tracking-[0.25em] text-white/60 uppercase mb-1">
                {node.era}
              </div>
              <h3 className="title-mystic text-white font-semibold text-[15px] mb-2">
                {node.title}
              </h3>
              <p className="text-[13px] leading-relaxed text-white/85">{node.body}</p>
            </motion.article>
          ))}
        </div>
      </div>

      <p className="text-center text-[11px] text-white/45 mt-6 mb-4 leading-relaxed">
        致谢 Pamela Colman Smith —— 那 78 张我们今天能读懂的画，是她画的。
      </p>
    </section>
  );
}
