import { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const NowPlayingBar: React.FC<NowPlayingBarProps> = ({ song }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    let interval: number;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.5;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying]);
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  if (!song) return null;
  
  return (
    <motion.div 
      className="bg-dark-gray border-t border-medium-gray p-3 grid grid-cols-3 items-center h-20"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Left: Song info */}
      <div className="flex items-center gap-3">
        <img 
          src={song.album_cover || 'https://via.placeholder.com/60'} 
          alt={`${song.name} cover`} 
          className="w-14 h-14 rounded object-cover" 
        />
        <div>
          <h4 className="text-sm font-medium line-clamp-1">{song.name}</h4>
          <p className="text-xs text-light-gray line-clamp-1">{song.artist}</p>
        </div>
        <button className="ml-2 text-light-gray hover:text-white">
          <Heart size={16} />
        </button>
      </div>
      
      {/* Center: Player controls */}
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-4">
          <button className="text-light-gray hover:text-white">
            <SkipBack size={18} />
          </button>
          <button 
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button className="text-light-gray hover:text-white">
            <SkipForward size={18} />
          </button>
        </div>
        
        <div className="w-full flex items-center gap-2 mt-1">
          <span className="text-xs text-light-gray">0:00</span>
          <div className="flex-1 h-1 bg-medium-gray rounded-full">
            <div 
              className="h-full bg-primary rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-xs text-light-gray">{song.duration || '3:30'}</span>
        </div>
      </div>
      
      {/* Right: Volume */}
      <div className="flex justify-end items-center">
        <div className="flex items-center gap-2">
          <Volume2 size={16} className="text-light-gray" />
          <div className="w-24 h-1 bg-medium-gray rounded-full">
            <div className="h-full w-3/4 bg-light-gray rounded-full"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NowPlayingBar;