import { useState } from 'react';
import { Camera, Upload, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const MoodDetector: React.FC<MoodDetectionProps> = ({ 
  onMoodDetected, 
  setLoading, 
  setError 
}) => {
  const [method, setMethod] = useState<'webcam' | 'upload'>('webcam');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/recommendations');
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      onMoodDetected(data.mood);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
      onMoodDetected(data.mood);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <motion.div 
      className="glass rounded-xl p-6 max-w-2xl mx-auto card-glow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Detect Your Mood</h2>
      
      {/* Method selection */}
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
      
      {/* Webcam method */}
      {method === 'webcam' && (
        <div className="text-center">
          <div className="bg-dark rounded-lg p-8 mb-6 flex items-center justify-center">
            <div className="relative w-48 h-48 rounded-full bg-medium-gray overflow-hidden flex items-center justify-center">
              <Camera size={48} className="text-light-gray opacity-50" />
              <div className="absolute inset-0 border-2 border-primary rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <motion.button
            className="bg-primary hover:bg-primary-dark text-black font-medium py-3 px-8 rounded-full inline-flex items-center gap-2 transition-colors"
            onClick={fetchRecommendations}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw size={18} />
            <span>Detect Mood</span>
          </motion.button>
        </div>
      )}
      
      {/* Upload method */}
      {method === 'upload' && (
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
            <label className="bg-primary hover:bg-primary-dark text-black font-medium py-3 px-8 rounded-full inline-flex items-center gap-2 transition-colors cursor-pointer">
              <Upload size={18} />
              <span>Choose Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MoodDetector;