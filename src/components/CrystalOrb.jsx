import { motion } from 'framer-motion';

/**
 * 水晶球：玻璃拟态 + 高光 + 轻微漂浮，颜色跟随牌组。
 * 位置由父组件（物理 hook）以 absolute left/top 传入。
 */
export default function CrystalOrb({
  group,
  x,
  y,
  radius = 56,
  onClick,
  delay = 0
}) {
  const size = radius * 2;

  return (
    <motion.button
      onClick={onClick}
      aria-label={`进入 ${group.nameZh} 牌组`}
      className="absolute rounded-full outline-none"
      style={{
        left: x - radius,
        top: y - radius,
        width: size,
        height: size,
        background: group.gradient,
        boxShadow: `0 0 42px ${group.glowColor}, inset -12px -16px 28px rgba(0,0,0,0.35), inset 14px 14px 30px rgba(255,255,255,0.5)`
      }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -8, 0]
      }}
      transition={{
        opacity: { duration: 0.6, delay },
        scale: { duration: 0.6, delay, type: 'spring', stiffness: 120, damping: 12 },
        y: { duration: 6 + delay, repeat: Infinity, ease: 'easeInOut' }
      }}
      whileTap={{ scale: 0.92 }}
    >
      {/* 高光点 */}
      <span
        className="absolute rounded-full bg-white/70 blur-[2px]"
        style={{
          width: size * 0.28,
          height: size * 0.18,
          left: size * 0.2,
          top: size * 0.16,
          transform: 'rotate(-20deg)'
        }}
      />
      {/* 反射小点 */}
      <span
        className="absolute rounded-full bg-white/90"
        style={{
          width: size * 0.08,
          height: size * 0.08,
          left: size * 0.3,
          top: size * 0.3
        }}
      />
      {/* 玻璃折射暗边 */}
      <span
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          boxShadow: 'inset 0 -4px 12px rgba(0,0,0,0.35), inset 0 3px 8px rgba(255,255,255,0.35)'
        }}
      />
      {/* 底部名字 */}
      <span
        className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-center text-white drop-shadow"
        style={{ top: size + 8 }}
      >
        <span className="block title-mystic text-sm font-semibold tracking-wide glow-text">
          {group.nameZh}
        </span>
        <span className="block text-[10px] opacity-75 tracking-[0.2em]">{group.nameEn}</span>
      </span>
    </motion.button>
  );
}
