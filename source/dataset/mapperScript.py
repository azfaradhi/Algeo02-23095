import os
import json

# Define the directory containing the audio files and images
audio_dir = 'midi_dataset/'
image_dir = 'image/'

# Define the output JSON file
output_file = './mapper.json'

image_extensions = ['.jpg', '.jpeg', '.png', '.gif']

# Function to generate the mappings
def generate_mappings(audio_dir, image_dir, output_file):
    mappings = []
    
    # Get the list of audio files
    audio_files = [f for f in os.listdir(audio_dir) if f.endswith('.mid')]
    
    # Generate mappings
    for audio_file in audio_files:
        # Assuming the image file has the same name as the audio file but with a different extension
        image_file = audio_file.replace('.mid', '.jpg')
        for ext in image_extensions:
            possible_image_file = os.path.splitext(audio_file)[0] + ext
            if os.path.exists(os.path.join(image_dir, possible_image_file)):
                image_file = possible_image_file
                break
        if not image_file:
            print(f"No corresponding image for audio file: {audio_file}")
            continue
        
        # Extract artist and song name from the file name
        artist, song_name = os.path.splitext(audio_file)[0].split(' - ', 1)
        
        mapping = {
            "audio": f"{audio_file}",
            "image": f"{image_file}",
            "songName": song_name,
            "artist": artist
        }
        mappings.append(mapping)
    
    # Write the mappings to the JSON file
    with open(output_file, 'w') as f:
        json.dump(mappings, f, indent=2)

# Generate the mappings
generate_mappings(audio_dir, image_dir, output_file)