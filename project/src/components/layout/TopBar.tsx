import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const TopBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [searchText, setSearchText] = useState('');
  const location = useLocation();
  const isSearchPage = location.pathname === '/search';
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = document.querySelector('.custom-scrollbar')?.scrollTop || 0;
      setScrolled(scrollPosition > 20);
    };
    
    const scrollableElement = document.querySelector('.custom-scrollbar');
    if (scrollableElement) {
      scrollableElement.addEventListener('scroll', handleScroll);
      return () => scrollableElement.removeEventListener('scroll', handleScroll);
    }
  }, []);
  
  return (
    <motion.div 
      className={`sticky top-0 z-10 p-4 flex items-center justify-between transition-all duration-300 ${
        scrolled ? 'bg-dark-gray shadow-md' : 'bg-transparent'
      }`}
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2">
          <button className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center">
            <ChevronLeft size={20} />
          </button>
          <button className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center">
            <ChevronRight size={20} />
          </button>
        </div>
        
        {isSearchPage && (
          <div className="relative flex-1 max-w-md">
            <Search 
              size={18} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-gray" 
            />
            <input
              type="text"
              placeholder="What do you want to listen to?"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full bg-medium-gray/50 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <motion.button 
          className="flex items-center gap-2 py-1 px-4 rounded-full bg-black"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <User size={16} />
          <span className="text-sm font-medium">Profile</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default TopBar;