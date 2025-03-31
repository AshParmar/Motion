import spotipy
from spotipy.oauth2 import SpotifyOAuth
import pandas as pd
import random

csv_path = r"C:\Users\ashpa\Downloads\Emotify-master\Emotify-master\songRecommender\data\data_moods.csv"
try:
    df = pd.read_csv(csv_path)
    if df.empty:
        print("ERROR: CSV file is empty!")
        exit()
except FileNotFoundError:
    print(f"ERROR: {csv_path} is missing!")
    exit()

sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
    client_id="1a805d0dca6842719eaeca01344af9f1",
    client_secret="6346b884f5db47cb85a0dc21d0ce85b8",
    redirect_uri="http://localhost:8000",
    scope="playlist-modify-public"
))

# Read mood from file
try:
    with open("./new.txt", "r") as fp:
        mood = fp.read().strip()
except FileNotFoundError:
    print("ERROR: Mood file not found!")
    exit()

df2 = df[df['mood'] == mood]

if df2.empty:
    print(f"ERROR: No songs found for mood: {mood}")
    exit()

df2 = df2.astype({'id': 'string'})
list_of_songs = ["spotify:track:" + str(row['id']) for _, row in df2.iterrows()]

# Select up to 15 songs
list_of_songs = random.sample(list_of_songs, min(15, len(list_of_songs)))

# Create playlist
playlist_name = f"{mood} Songs"
user_id = sp.me()['id']
playlist = sp.user_playlist_create(user=user_id, name=playlist_name, public=True, description=f"{mood} mood playlist")
playlist_id = playlist['id']

# Add tracks
sp.user_playlist_add_tracks(user=user_id, playlist_id=playlist_id, tracks=list_of_songs)

print(f"Created {mood} playlist: {playlist_id}")

# Save playlist ID for Flask
with open("./new.txt", "w") as fp:
    fp.write(playlist_id)
