import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cards } from '../data/cards.js';
import CardImage from '../components/CardImage.jsx';

function pickCard() {
  const card = cards[Math.floor(Math.random() * cards.length)];
  const reversed = Math.random() < 0.5;
  return { card, reversed };
}

export default function DrawPage() {
  const [draw, setDraw] = useState(null); // { card, reversed }
  const [shuffling, setShuffling] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const handleDraw = () => {
    setShuffling(true);
    setRevealed(false);
    // 洗牌过程 —— 给用户一点期待感
    setTimeout(() => {
      setDraw(pickCard());
      setShuffling(false);
      // 下一帧开始翻牌
      requestAnimationFrame(() => setRevealed(true));
    }, 700);
  };

  return (
    <section className="px-5 pt-6 safe-top">
      <header className="text-center mb-4">
        <h1 className="title-mystic text-xl font-semibold text-white glow-text">每日一牌</h1>
        <p className="text-white/65 text-[12px] mt-1 leading-relaxed">
          深呼吸，把注意力放在今天你想带着的一个问题上，再点击洗牌。
        </p>
      </header>

      <div className="flex flex-col items-center">
        {/* 卡片显示区 */}
        <div className="relative h-[360px] w-[240px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!draw && !shuffling && (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center text-white/50 text-sm px-6"
              >
                尚未抽牌 —— <br />
                点击下方按钮，让一张牌成为你今天的镜子。
              </motion.div>
            )}

            {shuffling && (
              <motion.div
                key="shuffling"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative w-[160px] h-[240px]"
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-2xl glass-dark"
                    style={{
                      boxShadow: '0 12px 30px rgba(0,0,0,0.4)'
                    }}
                    animate={{
                      rotate: [0, i === 0 ? -6 : i === 2 ? 6 : 0, 0],
                      y: [0, -10, 0]
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.12
                    }}
                  >
                    <div className="absolute inset-2 rounded-xl border border-white/20 flex items-center justify-center">
                      <span className="title-mystic text-white/60 text-xs tracking-widest">
                        TAROT
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {draw && !shuffling && (
              <motion.div
                key={draw.card.id + (revealed ? '1' : '0')}
                className="perspective w-[200px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="relative aspect-[2/3] w-full"
                  initial={{ rotateY: 180 }}
                  animate={{ rotateY: revealed ? (draw.reversed ? 360 : 0) : 180 }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* 背面 */}
                  <div
                    className="absolute inset-0 rounded-2xl glass-dark flex items-center justify-center backface-hidden rotate-y-180"
                    style={{
                      boxShadow: '0 16px 36px rgba(0,0,0,0.5)',
                      transform: 'rotateY(180deg)'
                    }}
                  >
                    <div className="absolute inset-2 rounded-xl border border-white/20 flex items-center justify-center">
                      <span className="title-mystic text-white/70 text-xs tracking-widest">
                        TAROT
                      </span>
                    </div>
                  </div>
                  {/* 正面 */}
                  <div
                    className="absolute inset-0 backface-hidden"
                    style={{
                      transform: draw.reversed ? 'rotate(180deg)' : 'none'
                    }}
                  >
                    <CardImage card={draw.card} className="w-full h-full" />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 结果文案 */}
        <AnimatePresence>
          {draw && !shuffling && revealed && (
            <motion.div
              key="info"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-4 w-full max-w-sm mx-auto text-center"
            >
              <div
                className={`inline-block text-[11px] px-2 py-0.5 rounded-full mb-2 ${
                  draw.reversed
                    ? 'bg-rose-500/20 border border-rose-300/40 text-rose-100'
                    : 'bg-emerald-500/20 border border-emerald-300/40 text-emerald-100'
                }`}
              >
                {draw.reversed ? '逆位' : '正位'}
              </div>
              <div className="title-mystic text-lg text-white font-semibold">
                {draw.card.nameZh}
                <span className="ml-2 text-white/60 text-xs">{draw.card.nameEn}</span>
              </div>
              <div className="mt-1 flex flex-wrap justify-center gap-1.5">
                {draw.card.keywords.map((k) => (
                  <span
                    key={k}
                    className="text-[11px] px-2 py-0.5 rounded-full glass text-white/90"
                  >
                    {k}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-white/85 glass rounded-2xl p-3 text-left">
                {draw.reversed ? draw.card.reversedMeaning : draw.card.uprightMeaning}
              </p>
              <Link
                to={`/card/${draw.card.id}`}
                className="inline-block mt-3 text-[12px] text-white/80 underline underline-offset-4"
              >
                查看完整讲解 →
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 按钮 */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleDraw}
            disabled={shuffling}
            className="px-6 py-3 rounded-full glass-strong text-white text-sm font-medium tracking-wide active:scale-95 transition-transform disabled:opacity-50"
          >
            {draw ? '再抽一张' : '开始洗牌'}
          </button>
          {draw && (
            <button
              onClick={() => {
                setDraw(null);
                setRevealed(false);
              }}
              className="px-5 py-3 rounded-full glass text-white/80 text-sm active:scale-95 transition-transform"
            >
              清空
            </button>
          )}
        </div>

        <p className="text-center text-[11px] text-white/45 mt-6 leading-relaxed max-w-xs">
          抽到的牌不是预言，而是今天可以陪你的一面镜子。
        </p>
      </div>
    </section>
  );
}
