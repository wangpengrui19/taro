import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

// 简洁矢量图标
const Icon = ({ name, className = '' }) => {
  const common = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', className };
  switch (name) {
    case 'home': // 星 + 光
      return (
        <svg {...common}>
          <path d="M12 3l2.4 5 5.6.8-4 3.9.9 5.6L12 15.9 7.1 18.3 8 12.7 4 8.8l5.6-.8L12 3z" />
        </svg>
      );
    case 'draw': // 三张卡牌
      return (
        <svg {...common}>
          <rect x="6" y="4" width="10" height="14" rx="2" transform="rotate(-8 11 11)" />
          <rect x="8" y="5" width="10" height="14" rx="2" transform="rotate(8 13 12)" />
        </svg>
      );
    case 'spreads': // 圣杯
      return (
        <svg {...common}>
          <path d="M6 4h12" />
          <path d="M6 4c0 5 2.5 8 6 8s6-3 6-8" />
          <path d="M12 12v6" />
          <path d="M8 20h8" />
        </svg>
      );
    case 'history': // 沙漏
      return (
        <svg {...common}>
          <path d="M7 3h10" />
          <path d="M7 21h10" />
          <path d="M7 3c0 5 10 6 10 9 0-3-10 4-10 9" />
          <path d="M17 3c0 5-10 6-10 9 0-3 10 4 10 9" />
        </svg>
      );
    case 'settings': // 月亮 + 齿
      return (
        <svg {...common}>
          <path d="M20 14A8 8 0 1 1 10 4a6 6 0 0 0 10 10z" />
        </svg>
      );
    default:
      return null;
  }
};

const items = [
  { to: '/', key: 'home', label: '首页', icon: 'home' },
  { to: '/spreads', key: 'spreads', label: '牌阵', icon: 'spreads' },
  { to: '/draw', key: 'draw', label: '抽牌', icon: 'draw', center: true },
  { to: '/history', key: 'history', label: '历史', icon: 'history' },
  { to: '/settings', key: 'settings', label: '设置', icon: 'settings' }
];

export default function BottomNav() {
  const location = useLocation();
  const isActive = (to) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  return (
    <nav
      className="fixed left-0 right-0 bottom-0 z-30 pointer-events-none"
      aria-label="底部导航"
    >
      <div className="relative max-w-xl mx-auto px-3 safe-bottom pointer-events-auto">
        {/* 圣杯轮廓 SVG 作为背景（顶边中间凹下去像杯沿） */}
        <svg
          viewBox="0 0 400 96"
          preserveAspectRatio="none"
          className="absolute left-3 right-3 bottom-3 w-[calc(100%-1.5rem)] h-[72px]"
          style={{ filter: 'drop-shadow(0 12px 30px rgba(10,5,40,0.5))' }}
          aria-hidden
        >
          <defs>
            <linearGradient id="navBg" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
              <stop offset="100%" stopColor="rgba(40,20,90,0.55)" />
            </linearGradient>
          </defs>
          {/* 顶部带弧度的杯沿：中间向下凹 */}
          <path
            d="
              M 16 28
              Q 16 8 36 8
              L 168 8
              Q 184 8 190 24
              Q 200 38 210 24
              Q 216 8 232 8
              L 364 8
              Q 384 8 384 28
              L 384 80
              Q 384 92 372 92
              L 28 92
              Q 16 92 16 80
              Z"
            fill="url(#navBg)"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="1"
          />
        </svg>

        {/* 中央抽牌按钮（从杯沿凹口冒出来） */}
        <div className="relative flex justify-center -mb-2" style={{ pointerEvents: 'none' }}>
          <NavLink
            to="/draw"
            className="pointer-events-auto relative -translate-y-4"
            aria-label="抽牌"
          >
            <motion.div
              whileTap={{ scale: 0.9 }}
              className={`relative w-16 h-16 rounded-full flex items-center justify-center text-white ${
                isActive('/draw') ? '' : 'opacity-95'
              }`}
              style={{
                background:
                  'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.8), rgba(180,140,255,0.65) 45%, rgba(90,36,220,0.9) 100%)',
                boxShadow:
                  '0 0 28px rgba(180,140,255,0.7), inset -6px -8px 16px rgba(0,0,0,0.35), inset 4px 6px 14px rgba(255,255,255,0.5)'
              }}
            >
              <Icon name="draw" className="drop-shadow" />
              {isActive('/draw') && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
              )}
            </motion.div>
            <span className="absolute left-1/2 -translate-x-1/2 -bottom-3 text-[10px] text-white/80 whitespace-nowrap">
              抽牌
            </span>
          </NavLink>
        </div>

        {/* 两侧 4 个 tab —— 上下层绝对定位叠加 */}
        <div className="relative h-[72px] grid grid-cols-5 items-center px-2">
          {items.map((it) =>
            it.center ? (
              <div key={it.key} />
            ) : (
              <NavLink
                key={it.key}
                to={it.to}
                end={it.to === '/'}
                className="flex flex-col items-center justify-center gap-1 h-full z-10"
              >
                {({ isActive: active }) => (
                  <>
                    <motion.span
                      whileTap={{ scale: 0.9 }}
                      className={`transition-colors ${
                        active ? 'text-white glow-text' : 'text-white/55'
                      }`}
                    >
                      <Icon name={it.icon} />
                    </motion.span>
                    <span
                      className={`text-[10px] tracking-wider transition-colors ${
                        active ? 'text-white' : 'text-white/55'
                      }`}
                    >
                      {it.label}
                    </span>
                    {active && (
                      <motion.span
                        layoutId="nav-dot"
                        className="absolute bottom-2 w-1 h-1 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]"
                      />
                    )}
                  </>
                )}
              </NavLink>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
