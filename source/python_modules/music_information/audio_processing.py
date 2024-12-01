import mido
import numpy as np


def midi_processing(namafile):
    midi = mido.MidiFile(namafile)
    midiNotes = []
    for track in midi.tracks:
        time = 0
        for msg in track:
            if msg.type == 'note_on' and msg.channel == 0:
                time += msg.time
                midiNotes.append((time,msg.note))

    notes = [note for _,note in midiNotes]

    meanPitch = np.mean(notes)
    stdPitch = np.std(notes)

    normalTempo = [(note - meanPitch) / stdPitch for note in notes]

    windows = []
    for start in range(0, len(normalTempo) - 40 + 1, 8):
        window = normalTempo[start:start + 40]
        windows.append(window)
    return windows