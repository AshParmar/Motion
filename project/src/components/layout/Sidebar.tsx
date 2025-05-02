import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Headphones, Library, PlusCircle, Heart, Sparkles, Music } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);

  return (
    <motion.aside 
      className="hidden md:flex flex-col bg-dark-gray h-full w-64 p-4"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8 flex items-center gap-3">
        <Headphones size={32} className="text-primary" />
        <span className="text-xl font-bold">Emotify</span>
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `flex items-center gap-4 p-3 rounded-md transition-colors hover:bg-medium-gray ${
                  isActive ? 'bg-medium-gray text-primary' : 'text-light-gray'
                }`
              }
            >
              <Home size={20} />
              <span>Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/search" 
              className={({ isActive }) => 
                `flex items-center gap-4 p-3 rounded-md transition-colors hover:bg-medium-gray ${
                  isActive ? 'bg-medium-gray text-primary' : 'text-light-gray'
                }`
              }
            >
              <Search size={20} />
              <span>Search</span>
            </NavLink>
          </li>
          <li>
            <div className="flex items-center gap-4 p-3 rounded-md text-light-gray cursor-pointer hover:bg-medium-gray transition-colors">
              <Library size={20} />
              <span>Your Library</span>
            </div>
          </li>
        </ul>
        
        <div className="mt-8">
          <div className="p-3">
            <h3 className="text-xs uppercase font-bold tracking-wider text-light-gray mb-4">
              Playlists
            </h3>
            <div className="flex items-center gap-2 p-2 rounded-md text-light-gray cursor-pointer hover:bg-medium-gray transition-colors">
              <PlusCircle size={18} />
              <span>Create Playlist</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-md text-light-gray cursor-pointer hover:bg-medium-gray transition-colors">
              <Heart size={18} />
              <span>Liked Songs</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 border-t border-medium-gray pt-4">
          <div className="p-3">
            <div className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-medium-gray transition-colors bg-gradient bg-opacity-30">
              <Sparkles size={18} className="text-white" />
              <span className="text-white">Your Mood Mixes</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-md text-light-gray cursor-pointer hover:bg-medium-gray transition-colors">
              <Music size={18} />
              <span>Discover Weekly</span>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="mt-auto p-4 text-xs text-light-gray">
        <p>© 2025 Emotify</p>
      </div>
    </motion.aside>
  );
};

export default Sidebar;