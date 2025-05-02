import { useState } from 'react';
import MoodDetector from '../components/features/MoodDetector';
import SongList from '../components/features/SongList';
import MoodVisualizer from '../components/features/MoodVisualizer';
import { motion } from 'framer-motion';
import { AlertTriangle, Loader } from 'lucide-react';

const HomePage: React.FC<HomePageProps> = ({ setCurrentSong }) => {
  const [mood, setMood] = useState<string>('');
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleMoodDetected = async (detectedMood: string) => {
    setMood(detectedMood);
    // Mock data for songs - in a real app, this would come from the backend
    // This is just to simulate the response from the backend
    const mockSongs: Song[] = [
      {
        id: '1',
        name: 'Blinding Lights',
        artist: 'The Weeknd',
        album_cover: 'https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526',
        link: 'https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b',
        duration: '3:20'
      },
      {
        id: '2',
        name: 'Don\'t Start Now',
        artist: 'Dua Lipa',
        album_cover: 'https://i.scdn.co/image/ab67616d0000b273bd26ede1ae69327010d49946',
        link: 'https://open.spotify.com/track/3PfIrDoz19wz7qK7tYeu62',
        duration: '3:03'
      },
      {
        id: '3',
        name: 'Watermelon Sugar',
        artist: 'Harry Styles',
        album_cover: 'https://i.scdn.co/image/ab67616d0000b2739e495fb707973f1b300db6f4',
        link: 'https://open.spotify.com/track/6UelLqGlWMcVH1E5c4H7lY',
        duration: '2:54'
      },
      {
        id: '4',
        name: 'Levitating',
        artist: 'Dua Lipa ft. DaBaby',
        album_cover: 'https://i.scdn.co/image/ab67616d0000b273bd26ede1ae69327010d49946',
        link: 'https://open.spotify.com/track/5nujrmhLynf4yMoMtj8AQF',
        duration: '3:23'
      },
      {
        id: '5',
        name: 'Save Your Tears',
        artist: 'The Weeknd',
        album_cover: 'https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526',
        link: 'https://open.spotify.com/track/5QO79kh1waicV47BqGRL3g',
        duration: '3:35'
      },
      {
        id: '6',
        name: 'Mood',
        artist: '24kGoldn ft. iann dior',
        album_cover: 'https://i.scdn.co/image/ab67616d0000b273d14a9688a7c6d89854b3640d',
        link: 'https://open.spotify.com/track/3tjFYV6RSFtuktYl3ZtYcq',
        duration: '2:21'
      }
    ];
    
    setSongs(mockSongs);
  };
  
  return (
    <div className="pb-20 md:pb-0">
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-2">Feel the Music</h1>
        <p className="text-light-gray">Discover songs that match your mood</p>
      </motion.div>
      
      <MoodDetector 
        onMoodDetected={handleMoodDetected}
        setLoading={setLoading}
        setError={setError}
      />
      
      {error && (
        <div className="mt-6 p-4 bg-medium-gray rounded-lg flex items-center gap-3 text-accent-pink">
          <AlertTriangle size={20} />
          <div>
            <p>{error}</p>
            {error.includes('Failed to fetch') && (
              <p className="text-sm text-light-gray mt-1">Make sure your Flask backend is running on port 5000</p>
            )}
          </div>
        </div>
      )}
      
      {loading && (
        <div className="text-center my-10">
          <Loader size={40} className="animate-spin mx-auto mb-4 text-primary" />
          <p className="text-light-gray">Analyzing your emotional state...</p>
        </div>
      )}
      
      {mood && !loading && (
        <>
          <div className="mt-10">
            <MoodVisualizer mood={mood} />
          </div>
          
          <div className="mt-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Recommended for You</h2>
            </div>
            
            <SongList songs={songs} setCurrentSong={setCurrentSong} />
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;