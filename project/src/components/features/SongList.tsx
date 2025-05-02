import { motion } from 'framer-motion';
import SongCard from './SongCard';

const SongList: React.FC<SongListProps> = ({ songs, setCurrentSong }) => {
  if (!songs.length) {
    return (
      <div className="text-center p-8">
        <p className="text-light-gray">No songs found. Try detecting your mood first.</p>
      </div>
    );
  }
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {songs.map((song, index) => (
        <SongCard key={song.id || index} song={song} setCurrentSong={setCurrentSong} />
      ))}
    </motion.div>
  );
};

export default SongList;