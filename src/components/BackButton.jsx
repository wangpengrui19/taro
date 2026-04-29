import { useNavigate } from 'react-router-dom';

export default function BackButton({ to, label = '返回', fallback = -1 }) {
  const navigate = useNavigate();
  const handle = () => {
    if (to) navigate(to);
    else navigate(fallback);
  };

  return (
    <button
      onClick={handle}
      className="inline-flex items-center gap-1 px-3 py-2 rounded-full glass text-white/90 text-sm active:scale-95 transition-transform"
      aria-label="返回"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M15 18L9 12L15 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>{label}</span>
    </button>
  );
}
