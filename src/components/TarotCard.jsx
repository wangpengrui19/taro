import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CardImage from './CardImage.jsx';

export default function TarotCard({ card, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.02, 0.3), duration: 0.35 }}
      whileTap={{ scale: 0.97 }}
    >
      <Link
        to={`/card/${card.id}`}
        className="block glass rounded-2xl overflow-hidden active:scale-[0.98] transition-transform"
      >
        <CardImage card={card} className="aspect-[2/3]" rounded="rounded-2xl" />
        <div className="px-2 pt-2 pb-2">
          <div className="title-mystic text-[13px] leading-tight text-white/95 truncate">
            {card.nameZh}
          </div>
          <div className="text-[10px] text-white/60 tracking-wider truncate">{card.nameEn}</div>
          <div className="mt-1 flex flex-wrap gap-1">
            {card.keywords.slice(0, 2).map((k) => (
              <span
                key={k}
                className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-white/80"
              >
                {k}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
