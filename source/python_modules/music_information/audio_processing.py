import mido
import numpy as np
import librosa

def wav_processing(namafile):
    
    #loading
    y, sr = librosa.load(namafile)

    # extract pitch
    pitches, magnitudes = librosa.piptrack(y=y, sr=sr)

    midiNotes = []

    while len(midiNotes) < 30:
        for t in range(pitches.shape[1]):
            index = magnitudes[:, t].argmax()
            pitch = pitches[index, t]
            if pitch > 0: 
                midiNotes.append(librosa.hz_to_midi(pitch))

        if len(midiNotes) >= 30:
            break

    # normalisasi
    meanPitch = np.mean(midiNotes)
    stdPitch = np.std(midiNotes)
    normalTempo = [(note - meanPitch) / stdPitch for note in midiNotes]

    # pembuatan windows
    windows = []
    for start in range(0, len(normalTempo) - 30 + 1,6):
        window = normalTempo[start:start + 30]
        windows.append(window)

    return windows

def midi_processing(namafile):
    try:
        midi = mido.MidiFile(namafile)
        midiNotes = []
        channel = 0

        while (True):
            for track in midi.tracks:
                for msg in track:
                    if msg.type == 'note_on' and msg.channel == channel and msg.velocity > 0:
                        if (0<= msg.note <= 127):
                            midiNotes.append(msg.note)
            if len(midiNotes) > 30:
                break
            else:
                channel += 1

        # normalisasi
        meanPitch = np.mean(midiNotes)
        stdPitch = np.std(midiNotes)
        if stdPitch == 0:
            normalTempo = [0 for _ in midiNotes]  
        else:
            normalTempo = [(note - meanPitch) / stdPitch for note in midiNotes]
        
        normalTempo = np.clip(normalTempo, 0, 127)

        # pembuatan windows
        windows = []
        for start in range(0, len(normalTempo) -30 + 1, 6):
            window = normalTempo[start:start + 30]
            windows.append(window)
        return windows
    except (OSError, ValueError) as e:
        return  []
