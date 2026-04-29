import { useEffect, useState } from 'react';

const THEMES = [
  { id: 'nebula', label: '星云紫', grad: 'radial-gradient(ellipse at top, #2a0f6b 0%, #1a0942 45%, #080320 100%)' },
  { id: 'dusk', label: '黄昏粉', grad: 'radial-gradient(ellipse at top, #4b1757 0%, #2b0e3f 45%, #120425 100%)' },
  { id: 'ocean', label: '深海蓝', grad: 'radial-gradient(ellipse at top, #0f2e5a 0%, #07153a 45%, #03081f 100%)' },
  { id: 'forest', label: '密林绿', grad: 'radial-gradient(ellipse at top, #0e3a32 0%, #06231d 45%, #030f0b 100%)' }
];

const LS_KEYS = {
  theme: 'taro:theme',
  notifications: 'taro:notify',
  fontSize: 'taro:fontSize'
};

export default function SettingsPage() {
  const [theme, setTheme] = useState(() => localStorage.getItem(LS_KEYS.theme) || 'nebula');
  const [notify, setNotify] = useState(() => localStorage.getItem(LS_KEYS.notifications) === '1');
  const [fontSize, setFontSize] = useState(
    () => Number(localStorage.getItem(LS_KEYS.fontSize)) || 16
  );

  useEffect(() => {
    const t = THEMES.find((x) => x.id === theme) || THEMES[0];
    document.body.style.background = t.grad + ' fixed';
    document.body.style.backgroundAttachment = 'fixed';
    localStorage.setItem(LS_KEYS.theme, theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
    localStorage.setItem(LS_KEYS.fontSize, String(fontSize));
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem(LS_KEYS.notifications, notify ? '1' : '0');
  }, [notify]);

  const logout = () => {
    if (confirm('这是一个本地体验 App，尚未接入账户系统。要清空本地偏好设置吗？')) {
      Object.values(LS_KEYS).forEach((k) => localStorage.removeItem(k));
      setTheme('nebula');
      setNotify(false);
      setFontSize(16);
    }
  };

  return (
    <section className="px-5 pt-6 safe-top">
      <header className="mb-5">
        <h1 className="title-mystic text-xl font-semibold text-white glow-text">用户设置</h1>
        <p className="text-white/65 text-[12px] mt-1">自定义你的塔罗学习空间。</p>
      </header>

      {/* 主题色 */}
      <div className="glass rounded-2xl p-4 mb-3">
        <div className="text-[11px] tracking-[0.25em] text-white/60 uppercase mb-3">
          背景主题
        </div>
        <div className="grid grid-cols-2 gap-2">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`relative rounded-xl p-3 text-left overflow-hidden border transition-all active:scale-[0.98] ${
                theme === t.id
                  ? 'border-white/70 ring-2 ring-white/40'
                  : 'border-white/15'
              }`}
              style={{ background: t.grad }}
            >
              <div className="h-10" />
              <div className="relative z-10 text-white text-[13px] font-medium">
                {t.label}
                {theme === t.id && <span className="ml-1 text-[10px]">· 当前</span>}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 字号 */}
      <div className="glass rounded-2xl p-4 mb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[11px] tracking-[0.25em] text-white/60 uppercase">
            阅读字号
          </div>
          <div className="text-white/80 text-[12px]">{fontSize}px</div>
        </div>
        <input
          type="range"
          min={14}
          max={20}
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="w-full accent-white"
        />
        <div className="mt-2 flex justify-between text-[10px] text-white/50">
          <span>小</span>
          <span>中</span>
          <span>大</span>
        </div>
      </div>

      {/* 通知 */}
      <div className="glass rounded-2xl p-4 mb-3 flex items-center justify-between">
        <div>
          <div className="text-white text-[14px]">接收系统消息</div>
          <div className="text-white/60 text-[11px] mt-0.5">
            如每日一牌提醒、新内容上线等（当前为本地模拟）。
          </div>
        </div>
        <button
          onClick={() => setNotify((v) => !v)}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            notify ? 'bg-nebula-400' : 'bg-white/20'
          }`}
          aria-pressed={notify}
          aria-label="切换通知"
        >
          <span
            className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
              notify ? 'translate-x-6' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>

      {/* 关于 */}
      <div className="glass rounded-2xl p-4 mb-3">
        <div className="text-[11px] tracking-[0.25em] text-white/60 uppercase mb-2">
          关于
        </div>
        <p className="text-[12px] text-white/80 leading-relaxed">
          本 App 仅作为学习与自我觉察的工具，不构成任何医疗、法律、投资或重大决策建议。遇到困难时，请优先寻找真实世界中可信赖的支持。
        </p>
      </div>

      {/* 登出 */}
      <button
        onClick={logout}
        className="w-full px-4 py-3 rounded-2xl border border-rose-300/30 bg-rose-500/10 text-rose-100 text-[13px] active:scale-[0.99] transition-transform"
      >
        清空本地偏好 / 退出登录
      </button>

      <p className="text-center text-[11px] text-white/45 mt-6 mb-4 leading-relaxed">
        v0.1 · Made with 💜 for Tarot beginners
      </p>
    </section>
  );
}
