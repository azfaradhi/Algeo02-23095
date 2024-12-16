import os

audio_dir = 'midi_dataset/'

def print_audio_files_with_album(audio_dir):

    audio_files = [f for f in os.listdir(audio_dir) if f.endswith('.mid')]
    
    for audio_file in audio_files:
        print(f"Album {audio_file}", end="")
        input()

print_audio_files_with_album(audio_dir)