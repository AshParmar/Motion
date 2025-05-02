import { Play, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const SongCard: React.FC<SongCardProps> = ({ song, setCurrentSong }) => {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const handlePlayOnSpotify = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (song.link) {
      window.open(song.link, '_blank');
    } else {
      window.open(`https://open.spotify.com/search/${encodeURIComponent(song.name + " " + song.artist)}`, '_blank');
    }
  };
  
  return (
    <motion.div
      className="bg-dark-gray rounded-lg overflow-hidden hover-scale card-glow"
      variants={item}
      whileHover={{ y: -5 }}
    >
      <div className="relative group cursor-pointer" onClick={() => setCurrentSong(song)}>
        <img 
          src={song.album_cover || 'https://via.placeholder.com/300'} 
          alt={`${song.name} cover`} 
          className="w-full aspect-square object-cover" 
        />
        
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <button 
            className="w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentSong(song);
            }}
          >
            <Play size={20} fill="black" />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-white truncate">{song.name}</h3>
        <p className="text-sm text-light-gray truncate mt-1">{song.artist}</p>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex space-x-1">
            {Array(5).fill(0).map((_, i) => (
              <span key={i} className="w-1 h-5 bg-primary opacity-25 rounded"></span>
            ))}
          </div>
          
          <button 
            className="text-light-gray hover:text-white transition-colors"
            onClick={handlePlayOnSpotify}
            title="Open in Spotify"
          >
            <ExternalLink size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SongCard;