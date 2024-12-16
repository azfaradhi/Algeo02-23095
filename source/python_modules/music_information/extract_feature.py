import numpy as np

import numpy as np

def absolute_tone_based(window):
    # if len(window) == 0 or any(np.isnan(window)) or any(np.isinf(window)):
    #     return np.zeros_like(np.arange(0, 128))
    
    # bins = np.arange(0, 128)
    
    # histogram, bin_edges = np.histogram(window, bins=bins, density=False)
    
    # if np.sum(histogram) == 0:
    #     histogram = np.zeros_like(histogram)
    
    # if np.sum(histogram) != 0:
    #     histogram = histogram / np.sum(histogram)
    
    # histogram = np.nan_to_num(histogram)
    
    # return histogram
    histogram = np.zeros(128)

    for note in window:

        if np.isnan(note) or np.isinf(note):
            
            continue
        note_idx = int(round(note))
        if (0 <= note_idx < 128):
            histogram[note_idx] += 1
    total = np.sum(histogram)
    if total > 0:
        histogram = histogram / total
    return histogram


def relative_tone_based(window):
    # bins = np.arange(-129,129)
    # intervals = np.diff(window)
    # histogram,_ = np.histogram(intervals, bins = bins, density=True)
    # return histogram
    histogram = np.zeros(255)
    if len(window) > 1:
        intervals = np.diff(window)

        for interval in intervals:

            if np.isnan(interval) or np.isinf(interval):
                continue

            interval_idx = int(round(interval)) + 127
            if 0 <= interval_idx < 255:
                histogram[interval_idx] += 1
    
    total = np.sum(histogram)
    if total > 0:
        histogram = histogram/total
    return histogram

def first_tone_based(window):
    # bins = np.arange(-128,129)
    # diff = [note - window[0] for note in window]
    # histogram, _ = np.histogram(diff,bins = bins, density=True)
    # return histogram
    histogram = np.zeros(255)
    if (len(window) > 0):
        first = window[0]
        intervals = window - first
        for interval in intervals:
            if np.isnan(interval) or np.isinf(interval):
                continue
            interval_idx = int(round(interval)) + 127
            if 0 <= interval_idx < 255:
                histogram[interval_idx] += 1
    total = np.sum(histogram)
    if total > 0:
        histogram = histogram / total
    return histogram


def extract_feature(windows):
    all_features = []
    for window in windows:  # window is a single numpy.ndarray
        window_features = {
            'atb': absolute_tone_based(window),    # window is numpy.ndarray of shape (20,)
            'rtb': relative_tone_based(window),    # window is numpy.ndarray of shape (20,)
            'ftb': first_tone_based(window)     # window is numpy.ndarray of shape (20,)
        }
        all_features.append(window_features)
    return all_features

# # namafile = "alb_esp1.mid"
# # windows = audio_processing.midi_processing(namafile)
# # all = extract_feature(windows)  