import { useState } from 'react';
import { Search as SearchIcon, Music, Disc, Mic, User, Play as Playlist } from 'lucide-react';
import { motion } from 'framer-motion';
import SongList from '../components/features/SongList';

const SearchPage: React.FC<SearchPageProps> = ({ setCurrentSong }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Mock search results - in a real app, this would be an API call
    setTimeout(() => {
      const mockResults: Song[] = [
        {
          id: '101',
          name: `${searchQuery} Hit`,
          artist: 'Popular Artist',
          album_cover: 'https://i.scdn.co/image/ab67616d0000b273521ce5127b7cc5d8f530566e',
          duration: '3:42'
        },
        {
          id: '102',
          name: `The ${searchQuery} Experience`,
          artist: 'Indie Band',
          album_cover: 'https://i.scdn.co/image/ab67616d0000b27382b243023b937fd579a35533',
          duration: '4:10'
        },
        {
          id: '103',
          name: `${searchQuery} Dreams`,
          artist: 'Electronic Producer',
          album_cover: 'https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96',
          duration: '2:55'
        },
        {
          id: '104',
          name: `${searchQuery} Nights`,
          artist: 'R&B Singer',
          album_cover: 'https://i.scdn.co/image/ab67616d0000b273a91c10fe9472d9bd89802e5a',
          duration: '3:18'
        }
      ];
      
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1000);
  };
  
  const categories = [
    { name: 'Pop', color: 'bg-accent-pink', icon: <Music size={20} /> },
    { name: 'Rock', color: 'bg-accent-purple', icon: <Disc size={20} /> },
    { name: 'Hip Hop', color: 'bg-primary', icon: <Mic size={20} /> },
    { name: 'Artists', color: 'bg-accent-blue', icon: <User size={20} /> },
    { name: 'New Releases', color: 'bg-yellow-500', icon: <Disc size={20} /> },
    { name: 'Podcasts', color: 'bg-red-500', icon: <Mic size={20} /> },
    { name: 'Charts', color: 'bg-orange-500', icon: <Playlist size={20} /> },
    { name: 'Mood', color: 'bg-gradient', icon: <Music size={20} /> },
  ];
  
  return (
    <div className="pb-20 md:pb-0">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-4">Search</h1>
        
        <form onSubmit={handleSearch} className="relative mb-8">
          <SearchIcon 
            size={20} 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-light-gray" 
          />
          <input
            type="text"
            placeholder="What do you want to listen to?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-medium-gray rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </form>
        
        {searchQuery ? (
          <div>
            {isSearching ? (
              <div className="text-center py-10">
                <div className="wave mx-auto">
                  {Array(8).fill(0).map((_, i) => (
                    <span key={i}></span>
                  ))}
                </div>
                <p className="text-light-gray mt-4">Searching...</p>
              </div>
            ) : (
              <>
                {searchResults.length > 0 ? (
                  <div className="mt-6">
                    <h2 className="text-2xl font-bold mb-6">Search Results</h2>
                    <SongList songs={searchResults} setCurrentSong={setCurrentSong} />
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-light-gray">No results found for "{searchQuery}"</p>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold mb-4">Browse Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {categories.map((category, index) => (
                <motion.div
                  key={category.name}
                  className={`${category.color} rounded-lg p-4 h-40 flex flex-col justify-end cursor-pointer hover-scale`}
                  whileHover={{ scale: 1.03 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div className="mb-2">{category.icon}</div>
                  <h3 className="text-lg font-bold">{category.name}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;