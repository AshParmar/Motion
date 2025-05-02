import React from 'react';
import { motion } from 'framer-motion';

interface MoodVisualizerProps {
  mood: string;
}

const MoodVisualizer: React.FC<MoodVisualizerProps> = ({ mood }) => {
  // Map moods to colors and emojis
  const moodMap: Record<string, { color: string, emoji: string }> = {
    happy: { color: '#FFD700', emoji: '😊' },
    sad: { color: '#6495ED', emoji: '😢' },
    angry: { color: '#FF4500', emoji: '😡' },
    neutral: { color: '#A9A9A9', emoji: '😐' },
    surprised: { color: '#FF69B4', emoji: '😲' },
    fearful: { color: '#800080', emoji: '😨' },
    disgusted: { color: '#32CD32', emoji: '🤢' },
    // Default for any other mood
    default: { color: '#1ED760', emoji: '🎵' }
  };

  const moodInfo = moodMap[mood.toLowerCase()] || moodMap.default;
  
  // Create animated particles
  const particles = Array.from({ length: 20 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute rounded-full"
      initial={{ 
        x: '50%', 
        y: '50%', 
        opacity: 0,
        scale: 0
      }}
      animate={{ 
        x: `${Math.random() * 100}%`, 
        y: `${Math.random() * 100}%`, 
        opacity: Math.random() * 0.7,
        scale: Math.random() * 0.5 + 0.5
      }}
      transition={{
        duration: Math.random() * 5 + 3,
        repeat: Infinity,
        repeatType: "reverse"
      }}
      style={{
        backgroundColor: moodInfo.color,
        width: `${Math.random() * 10 + 5}px`,
        height: `${Math.random() * 10 + 5}px`,
      }}
    />
  ));
  
  return (
    <motion.div 
      className="relative py-8 px-4 overflow-hidden rounded-xl mb-8 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{ 
        background: `linear-gradient(135deg, ${moodInfo.color}33, ${moodInfo.color}11)`,
        borderLeft: `4px solid ${moodInfo.color}`
      }}
    >
      {particles}
      
      <motion.div 
        className="relative z-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-4xl mb-3">{moodInfo.emoji}</div>
        <h2 className="text-2xl font-bold mb-2">Your Current Mood</h2>
        <div 
          className="text-5xl font-bold py-2 px-6 rounded-lg inline-block"
          style={{ 
            color: moodInfo.color,
            textShadow: `0 0 10px ${moodInfo.color}66` 
          }}
        >
          {mood.toUpperCase()}
        </div>
        <p className="mt-3 text-light-gray max-w-md mx-auto">
          We've detected your mood and curated a personalized playlist just for you. Enjoy these songs that match your emotional state.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default MoodVisualizer;