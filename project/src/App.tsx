import { useState } from 'react';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Search, Library, Headphones, Heart, Play, Pause, SkipBack, SkipForward, Volume2, User, Camera, Upload, RefreshCw, ExternalLink, AlertTriangle } from 'lucide-react';
import './App.css';

// Initialize Spotify SDK
const spotify = SpotifyApi.withClientCredentials(
  import.meta.env.VITE_SPOTIFY_CLIENT_ID || '1a805d0dca6842719eaeca01344af9f1',
  import.meta.env.VITE_SPOTIFY_CLIENT_SECRET || '6346b884f5db47cb85a0dc21d0ce85b8'
);

interface BackendSong {
  name: string;
  artist: string;
  album_cover?: string;
  link?: string;
}

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'search' | 'library'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [homeRecommendations, setHomeRecommendations] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [librarySongs, setLibrarySongs] = useState<any[]>([]);
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mood, setMood] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState<'webcam' | 'upload'>('webcam');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setLoading(true);
      const results = await spotify.search(searchQuery, ['track'], 'US', 20);
      setSearchResults(results.tracks.items);
    } catch (err: any) {
      setError('Failed to search tracks: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle mood detection
  const handleMoodDetection = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/recommendations');
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      setMood(data.mood);
      
      if (data.recommended_songs && data.recommended_songs.length > 0) {
        const transformedSongs = data.recommended_songs.map((song: BackendSong) => ({
          id: `backend-${Math.random().toString(36).substr(2, 9)}`,
          name: song.name,
          artists: [{ name: song.artist }],
          album: {
            images: song.album_cover ? [{ url: song.album_cover }] : []
          },
          external_urls: {
            spotify: song.link || `https://open.spotify.com/search/${encodeURIComponent(song.name + " " + song.artist)}`
          },
          duration_ms: 180000
        }));
        
        setHomeRecommendations(transformedSongs);
      } else {
        setError('No songs found for your mood');
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Detection error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      setImagePreview(URL.createObjectURL(file));
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:5000/recommendations', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setMood(data.mood);
      
      if (data.recommended_songs && data.recommended_songs.length > 0) {
        const transformedSongs = data.recommended_songs.map((song: BackendSong) => ({
          id: `backend-${Math.random().toString(36).substr(2, 9)}`,
          name: song.name,
          artists: [{ name: song.artist }],
          album: {
            images: song.album_cover ? [{ url: song.album_cover }] : []
          },
          external_urls: {
            spotify: song.link || `https://open.spotify.com/search/${encodeURIComponent(song.name + " " + song.artist)}`
          },
          duration_ms: 180000
        }));
        
        setHomeRecommendations(transformedSongs);
      } else {
        setError('No songs found for your mood');
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle like song
  const toggleLike = (song: any) => {
    setLibrarySongs(prev => {
      const isLiked = prev.some(s => s.id === song.id);
      if (isLiked) {
        return prev.filter(s => s.id !== song.id);
      }
      return [...prev, song];
    });
  };

  const renderSongCard = (track: any, source: 'home' | 'search' | 'library') => {
    const isLiked = librarySongs.some(s => s.id === track.id);
    
    return (
      <motion.div
        key={track.id}
        className="bg-dark-gray rounded-lg overflow-hidden hover-scale card-glow"
        whileHover={{ y: -5 }}
      >
        <div className="relative group cursor-pointer" onClick={() => {
          setCurrentSong(track);
          setIsPlaying(true);
        }}>
          {track.album.images[0]?.url ? (
            <img 
              src={track.album.images[0].url} 
              alt={`${track.name} cover`} 
              className="w-full aspect-square object-cover" 
            />
          ) : (
            <div className="w-full aspect-square bg-medium-gray flex items-center justify-center">
              <Headphones size={48} className="text-light-gray" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <button 
              className="w-12 h-12 rounded-full bg-primary text-black flex items-center justify-center shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSong(track);
                setIsPlaying(true);
              }}
            >
              <Play size={20} fill="black" />
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-medium text-white truncate">{track.name}</h3>
          <p className="text-sm text-light-gray truncate mt-1">{track.artists[0].name}</p>
          
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLike(track);
              }}
              className={`text-2xl ${isLiked ? 'text-primary' : 'text-light-gray hover:text-white'}`}
            >
              <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
            </button>
            
            <a 
              href={track.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="text-light-gray hover:text-white transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex h-screen bg-dark text-white overflow-hidden">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col bg-dark-gray w-64 p-4">
        <div className="mb-8 flex items-center gap-3">
          <Headphones size={32} className="text-primary" />
          <span className="text-xl font-bold">Motion</span>
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setCurrentView('home')}
                className={`flex items-center gap-4 p-3 rounded-md w-full transition-colors hover:bg-medium-gray ${
                  currentView === 'home' ? 'bg-medium-gray text-primary' : 'text-light-gray'
                }`}
              >
                <Home size={20} />
                <span>Home</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentView('search')}
                className={`flex items-center gap-4 p-3 rounded-md w-full transition-colors hover:bg-medium-gray ${
                  currentView === 'search' ? 'bg-medium-gray text-primary' : 'text-light-gray'
                }`}
              >
                <Search size={20} />
                <span>Search</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setCurrentView('library')}
                className={`flex items-center gap-4 p-3 rounded-md w-full transition-colors hover:bg-medium-gray ${
                  currentView === 'library' ? 'bg-medium-gray text-primary' : 'text-light-gray'
                }`}
              >
                <Library size={20} />
                <span>Your Library</span>
              </button>
            </li>
          </ul>
          
          <div className="mt-8 p-3">
            <h3 className="text-xs uppercase font-bold tracking-wider text-light-gray mb-4">
              Playlists
            </h3>
            <div className="space-y-2">
              <button 
                onClick={() => setCurrentView('library')}
                className="flex items-center gap-2 p-2 rounded-md text-light-gray w-full hover:bg-medium-gray transition-colors"
              >
                <Heart size={18} />
                <span>Liked Songs ({librarySongs.length})</span>
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="sticky top-0 z-10 p-4 flex items-center justify-between bg-dark-gray">
          <div className="flex-1 max-w-xl">
            {currentView === 'search' && (
              <div className="relative">
                <Search 
                  size={18} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-gray" 
                />
                <input
                  type="text"
                  placeholder="What do you want to listen to?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full bg-medium-gray/50 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}
          </div>
          
          <motion.button 
            className="flex items-center gap-2 py-1 px-4 rounded-full bg-black"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <User size={16} />
            <span className="text-sm font-medium">Profile</span>
          </motion.button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
          <AnimatePresence mode="wait">
            {currentView === 'home' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="mb-8">
                  <h1 className="text-4xl font-bold mb-2">Feel the Music</h1>
                  <p className="text-light-gray">Discover songs that match your mood</p>
                </div>

                <motion.div 
                  className="glass rounded-xl p-6 max-w-2xl mx-auto card-glow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl font-bold mb-6 text-center">Detect Your Mood</h2>
                  
                  <div className="flex bg-dark rounded-lg overflow-hidden mb-6">
                    <button
                      className={`flex-1 flex items-center justify-center gap-2 py-3 transition ${
                        method === 'webcam' 
                          ? 'bg-gradient text-white font-medium' 
                          : 'bg-medium-gray text-light-gray'
                      }`}
                      onClick={() => setMethod('webcam')}
                    >
                      <Camera size={18} />
                      <span>Use Webcam</span>
                    </button>
                    <button
                      className={`flex-1 flex items-center justify-center gap-2 py-3 transition ${
                        method === 'upload' 
                          ? 'bg-gradient text-white font-medium' 
                          : 'bg-medium-gray text-light-gray'
                      }`}
                      onClick={() => setMethod('upload')}
                    >
                      <Upload size={18} />
                      <span>Upload Photo</span>
                    </button>
                  </div>
                  
                  {method === 'webcam' ? (
                    <div className="text-center">
                      <div className="bg-dark rounded-lg p-8 mb-6 flex items-center justify-center">
                        <div className="relative w-48 h-48 rounded-full bg-medium-gray overflow-hidden flex items-center justify-center">
                          <Camera size={48} className="text-light-gray opacity-50" />
                          <div className="absolute inset-0 border-2 border-primary rounded-full animate-pulse"></div>
                        </div>
                      </div>
                      
                      <motion.button
                        className="bg-primary hover:bg-primary-dark text-black font-medium py-3 px-8 rounded-full inline-flex items-center gap-2 transition-colors"
                        onClick={handleMoodDetection}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={loading}
                      >
                        <RefreshCw size={18} />
                        <span>{loading ? 'Detecting...' : 'Detect Mood'}</span>
                      </motion.button>
                    </div>
                  ) : (
                    <div>
                      <div className="bg-dark rounded-lg p-6 mb-6">
                        {imagePreview ? (
                          <div className="flex justify-center">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="max-h-64 rounded-lg object-contain"
                            />
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-medium-gray rounded-lg p-8 text-center">
                            <Upload size={32} className="mx-auto mb-4 text-light-gray" />
                            <p className="text-light-gray mb-4">Drag and drop your photo here</p>
                            <p className="text-xs text-light-gray">or</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-center">
                        <label className={`bg-primary hover:bg-primary-dark text-black font-medium py-3 px-8 rounded-full inline-flex items-center gap-2 transition-colors cursor-pointer ${loading ? 'opacity-50' : ''}`}>
                          <Upload size={18} />
                          <span>Choose Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={loading}
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </motion.div>

                {error && (
                  <div className="mt-6 p-4 bg-medium-gray rounded-lg flex items-center gap-3 text-accent-pink">
                    <AlertTriangle size={20} />
                    <p>{error}</p>
                  </div>
                )}

                {loading && (
                  <div className="text-center my-10">
                    <div className="wave mx-auto">
                      {Array(8).fill(0).map((_, i) => (
                        <span key={i}></span>
                      ))}
                    </div>
                    <p className="text-light-gray mt-4">Analyzing your mood...</p>
                  </div>
                )}

                {mood && !loading && (
                  <div className="mt-10">
                    <div className="relative py-8 px-4 overflow-hidden rounded-xl mb-8 text-center bg-gradient">
                      <motion.div 
                        className="relative z-10"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <h2 className="text-2xl font-bold mb-2">Your Current Mood</h2>
                        <div className="text-5xl font-bold py-2 px-6 rounded-lg inline-block">
                          {mood.toUpperCase()}
                        </div>
                      </motion.div>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-2xl font-bold mb-6">Recommended Songs</h3>
                      {homeRecommendations.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {homeRecommendations.map((track: any) => (
                            renderSongCard(track, 'home')
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-light-gray py-8">
                          <p>No songs found for this mood</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {currentView === 'search' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h1 className="text-4xl font-bold mb-8">Search</h1>
                {searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {searchResults.map((track: any) => (
                      renderSongCard(track, 'search')
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-light-gray py-8">
                    <p>No search results yet</p>
                  </div>
                )}
              </motion.div>
            )}

            {currentView === 'library' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h1 className="text-4xl font-bold mb-8">Your Library</h1>
                {librarySongs.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {librarySongs.map((track: any) => (
                      renderSongCard(track, 'library')
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-light-gray">
                    <p>No liked songs yet. Start liking songs to see them here!</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Now Playing Bar */}
        {currentSong && (
          <motion.div 
            className="bg-dark-gray border-t border-medium-gray p-3 grid grid-cols-3 items-center h-20"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <img 
                src={currentSong.album.images[0]?.url || 'https://via.placeholder.com/60'} 
                alt={`${currentSong.name} cover`} 
                className="w-14 h-14 rounded object-cover" 
              />
              <div>
                <h4 className="text-sm font-medium line-clamp-1">{currentSong.name}</h4>
                <p className="text-xs text-light-gray line-clamp-1">{currentSong.artists[0].name}</p>
              </div>
              <button
                onClick={() => toggleLike(currentSong)}
                className={`ml-2 ${
                  librarySongs.some(s => s.id === currentSong.id)
                    ? 'text-primary'
                    : 'text-light-gray hover:text-white'
                }`}
              >
                <Heart size={16} fill={librarySongs.some(s => s.id === currentSong.id) ? 'currentColor' : 'none'} />
              </button>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-4">
                <button className="text-light-gray hover:text-white">
                  <SkipBack size={18} />
                </button>
                <button 
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black"
                  onClick={() => setIsPlaying(!isPlaying)}
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
                  <div className="h-full w-0 bg-primary rounded-full"></div>
                </div>
                <span className="text-xs text-light-gray">
  {Math.floor(currentSong.duration_ms / 60000)}:
  {String(Math.floor((currentSong.duration_ms % 60000) / 1000)).padStart(2, '0')}
</span>
              </div>
            </div>
            
            <div className="flex justify-end items-center">
              <div className="flex items-center gap-2">
                <Volume2 size={16} className="text-light-gray" />
                <div className="w-24 h-1 bg-medium-gray rounded-full">
                  <div className="h-full w-3/4 bg-light-gray rounded-full"></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-dark-gray z-10 border-t border-medium-gray">
        <nav className="flex justify-around py-3">
          <button 
            onClick={() => setCurrentView('home')}
            className={`flex flex-col items-center px-4 ${
              currentView === 'home' ? 'text-primary' : 'text-light-gray'
            }`}
          >
            <Home size={20} />
            <span className="text-xs mt-1">Home</span>
          </button>
          
          <button 
            onClick={() => setCurrentView('search')}
            className={`flex flex-col items-center px-4 ${
              currentView === 'search' ? 'text-primary' : 'text-light-gray'
            }`}
          >
            <Search size={20} />
            <span className="text-xs mt-1">Search</span>
          </button>
          
          <button 
            onClick={() => setCurrentView('library')}
            className={`flex flex-col items-center px-4 ${
              currentView === 'library' ? 'text-primary' : 'text-light-gray'
            }`}
          >
            <Library size={20} />
            <span className="text-xs mt-1">Library</span>
          </button>
        </nav>
      </div>
    </div>
  );
}

export default App;