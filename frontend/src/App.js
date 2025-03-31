import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [mood, setMood] = useState('');
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [method, setMethod] = useState('webcam'); // 'webcam' or 'upload'
  const [imagePreview, setImagePreview] = useState(null);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/recommendations');
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      setMood(data.mood);
      setSongs(data.recommended_songs || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
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
      setSongs(data.recommended_songs || []);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const playOnSpotify = (song) => {
    if (song.link) {
      window.open(song.link, '_blank');
    } else {
      // Fallback to search if direct link not available
      window.open(`https://open.spotify.com/search/${encodeURIComponent(song.name + " " + song.artist)}`, '_blank');
    }
  };

  return (
    <div className="app-container">
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <span className="navbar-brand mb-0 h1">Emotify</span>
        </div>
      </nav>

      <main className="container mt-4">
        <div className="text-center mb-5">
          <h1 className="display-4">Mood-Based Music Recommendations</h1>
          <p className="lead">Discover songs that match your current emotion</p>
        </div>

        <div className="row justify-content-center mb-4">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body">
                <div className="btn-group w-100" role="group">
                  <button
                    className={`btn ${method === 'webcam' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setMethod('webcam')}
                  >
                    Use Webcam
                  </button>
                  <button
                    className={`btn ${method === 'upload' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setMethod('upload')}
                  >
                    Upload Image
                  </button>
                </div>

                {method === 'webcam' ? (
                  <div className="text-center mt-3">
                    <button
                      className="btn btn-success"
                      onClick={fetchRecommendations}
                      disabled={loading}
                    >
                      {loading ? 'Detecting Mood...' : 'Start Detection'}
                    </button>
                  </div>
                ) : (
                  <div className="mt-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="form-control"
                      disabled={loading}
                    />
                    {imagePreview && (
                      <div className="mt-3 text-center">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="img-fluid rounded"
                          style={{maxHeight: '200px'}}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger text-center">
            {error}
            <br />
            {error.includes('Failed to fetch') && (
              <small>Make sure your Flask backend is running on port 5000</small>
            )}
          </div>
        )}

        {loading && (
          <div className="text-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Analyzing your mood...</p>
          </div>
        )}

        {mood && !loading && (
          <div className="results-section">
            <div className="text-center mb-4">
              <h2>Your Mood: <span className="badge bg-info">{mood}</span></h2>
            </div>

            {songs.length > 0 ? (
              <div className="row">
                {songs.map((song, index) => (
                  <div key={index} className="col-md-4 mb-4">
                    <div className="card h-100">
                      <div className="card-body text-center">
                        <h5 className="card-title">{song.name}</h5>
                        <p className="card-text text-muted">{song.artist}</p>
                        {song.album_cover && (
                          <img
                            src={song.album_cover}
                            alt="Album cover"
                            className="img-fluid mb-3 rounded"
                            style={{maxHeight: '200px'}}
                          />
                        )}
                      </div>
                      <div className="card-footer bg-transparent text-center">
                        <button
                          onClick={() => playOnSpotify(song)}
                          className="btn btn-success"
                        >
                          Play on Spotify
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert alert-warning text-center">
                No songs found for this mood. Please try again.
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="bg-dark text-white text-center py-3 mt-5">
        <p>© {new Date().getFullYear()} Emotify - Mood-Based Music Recommendations</p>
      </footer>
    </div>
  );
}

export default App;