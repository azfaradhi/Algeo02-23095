import mido

namafile = "alb_esp1.mid"
midi = mido.MidiFile(namafile)
# midiNotes = []
# for track in midi.tracks:
#     time = 0
#     for msg in track:
#         if msg.type == 'note_on' and msg.channel == 0:
#             time += msg.time
#             midiNotes.append((time,msg.note))

print(midi)
