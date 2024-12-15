import os

# Define the directory containing the audio files
audio_dir = 'midi_dataset/'

# Function to print the names of the audio files with "Album: " in front
def print_audio_files_with_album(audio_dir):
    # Get the list of audio files
    audio_files = [f for f in os.listdir(audio_dir) if f.endswith('.mid')]
    
    # Print each audio file name with "Album: " in front
    for audio_file in audio_files:
        print(f"Album {audio_file}", end="")
        input()

# Print the audio files
print_audio_files_with_album(audio_dir)