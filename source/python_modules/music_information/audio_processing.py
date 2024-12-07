import mido
import numpy as np


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
    # print(channel)
    # print(midiNotes)

    
    meanPitch = np.mean(midiNotes)
    stdPitch = np.std(midiNotes)
    normalTempo = [(note - meanPitch) / stdPitch for note in midiNotes]

    windows = []
    for start in range(0, len(normalTempo) -20 + 1, 4):
        window = normalTempo[start:start + 20]
        windows.append(window)
    return windows

# namafile = "x (26).mid"
# midi = mido.MidiFile(namafile)
# a = midi_processing(namafile)
# print(a)
