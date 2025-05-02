import { Home, Search, Library, Headphones } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const MobileNavigation = () => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-dark-gray z-10 border-t border-medium-gray">
      <nav className="flex justify-around py-3">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `flex flex-col items-center px-4 ${isActive ? 'text-primary' : 'text-light-gray'}`
          }
        >
          <Home size={20} />
          <span className="text-xs mt-1">Home</span>
        </NavLink>
        
        <NavLink 
          to="/search" 
          className={({ isActive }) => 
            `flex flex-col items-center px-4 ${isActive ? 'text-primary' : 'text-light-gray'}`
          }
        >
          <Search size={20} />
          <span className="text-xs mt-1">Search</span>
        </NavLink>
        
        <div className="flex flex-col items-center px-4 text-light-gray">
          <Library size={20} />
          <span className="text-xs mt-1">Library</span>
        </div>
        
        <div className="flex flex-col items-center px-4 text-light-gray">
          <Headphones size={20} />
          <span className="text-xs mt-1">Emotify</span>
        </div>
      </nav>
    </div>
  );
};

export default MobileNavigation;