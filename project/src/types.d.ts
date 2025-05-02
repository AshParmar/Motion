interface Song {
  id: string;
  name: string;
  artist: string;
  album_cover?: string;
  link?: string;
  duration?: string;
}

interface CurrentMood {
  mood: string;
  color: string;
  emoji: string;
}

interface MoodDetectionProps {
  onMoodDetected: (mood: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

interface SongListProps {
  songs: Song[];
  setCurrentSong: (song: Song) => void;
}

interface SongCardProps {
  song: Song;
  setCurrentSong: (song: Song) => void;
}

interface NowPlayingBarProps {
  song: Song | null;
}

interface SidebarProps {}

interface TopBarProps {}

interface MobileNavigationProps {}

interface HomePageProps {
  setCurrentSong: (song: Song) => void;
}

interface SearchPageProps {
  setCurrentSong: (song: Song) => void;
}