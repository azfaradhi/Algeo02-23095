import numpy as np
import audio_processing


def absolute_tone_based(window):
    bins = np.arange(0,128)
    histogram,_ = np.histogram(window, bins=bins, density=True)
    return histogram

def relative_tone_based(window):
    bins = np.arange(-127,129)
    intervals = np.diff(window)
    histogram,_ = np.histogram(intervals, bins = bins, density=True)
    return histogram

def first_tone_based(window):
    bins = np.arange(-127,129)
    diff = [note - window[0] for note in window]
    histogram, _ = np.histogram(diff,bins = bins, density=True)
    return histogram

def extract_feature(windows):
    features = []
    for window in windows:
        atb = absolute_tone_based(window)
        rtb = relative_tone_based(window)
        ftb = first_tone_based(window)
        features.append({"ATB":atb, "RTB":rtb, "FTB":ftb})
    return features

# namafile = "testmidi/alb_esp1.mid"
# window = audio_processing.midi_processing(namafile)
# features = extract_feature(window)