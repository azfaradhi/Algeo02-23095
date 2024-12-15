import mido
import numpy as np
import librosa

def wav_processing(namafile):
    
    #loading
    y, sr = librosa.load(namafile)

    # extract pitch
    pitches, magnitudes = librosa.piptrack(y=y, sr=sr)

    midiNotes = []

    while len(midiNotes) < 20:
        for t in range(pitches.shape[1]):
            index = magnitudes[:, t].argmax()
            pitch = pitches[index, t]
            if pitch > 0: 
                midiNotes.append(librosa.hz_to_midi(pitch))

        if len(midiNotes) >= 20:
            break

    # normalisasi
    meanPitch = np.mean(midiNotes)
    stdPitch = np.std(midiNotes)
    normalTempo = [(note - meanPitch) / stdPitch for note in midiNotes]

    # pembuatan windows
    windows = []
    for start in range(0, len(normalTempo) - 20 + 1, 4):
        window = normalTempo[start:start + 20]
        windows.append(window)

    return windows

def midi_processing(namafile):
    midi = mido.MidiFile(namafile)
    midiNotes = []
    channel = 0

    while (True):
        for track in midi.tracks:
            for msg in track:
                if msg.type == 'note_on' and msg.channel == channel and msg.velocity > 0:
                    midiNotes.append(msg.note)
        if len(midiNotes) > 20:
            break
        else:
            channel += 1


    # normalisasi
    meanPitch = np.mean(midiNotes)
    stdPitch = np.std(midiNotes)
    normalTempo = [(note - meanPitch) / stdPitch for note in midiNotes]

    # pembuatan windows
    windows = []
    for start in range(0, len(normalTempo) -20 + 1, 4):
        window = normalTempo[start:start + 20]
        windows.append(window)
    return windows



# namafile = "x (26).mid"
# midi = mido.MidiFile(namafile)
# a = midi_processing(namafile)
# print(a)

# namafile = "beethoven.wav"
# windows = wav_processing(namafile)
# print(windows)