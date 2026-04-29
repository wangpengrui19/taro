import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import HomePage from './pages/HomePage.jsx';
import DeckPage from './pages/DeckPage.jsx';
import CardDetailPage from './pages/CardDetailPage.jsx';
import DrawPage from './pages/DrawPage.jsx';
import SpreadsPage from './pages/SpreadsPage.jsx';
import SpreadDetailPage from './pages/SpreadDetailPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import BottomNav from './components/BottomNav.jsx';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: 'easeIn' } }
};

function PageWrapper({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-full"
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <div className="relative min-h-full starfield">
      <div className="relative z-10 pb-28">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
            <Route path="/deck/:deckId" element={<PageWrapper><DeckPage /></PageWrapper>} />
            <Route path="/card/:cardId" element={<PageWrapper><CardDetailPage /></PageWrapper>} />
            <Route path="/draw" element={<PageWrapper><DrawPage /></PageWrapper>} />
            <Route path="/spreads" element={<PageWrapper><SpreadsPage /></PageWrapper>} />
            <Route path="/spreads/:spreadId" element={<PageWrapper><SpreadDetailPage /></PageWrapper>} />
            <Route path="/history" element={<PageWrapper><HistoryPage /></PageWrapper>} />
            <Route path="/settings" element={<PageWrapper><SettingsPage /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </div>
      <BottomNav />
    </div>
  );
}
