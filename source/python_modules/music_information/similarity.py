import numpy as np
from scipy.spatial.distance import cosine
import audio_processing
import extract_feature

def similarity_calculator(features, database):
    similarity = []
    
    for idx, db_features in enumerate(database):
        for feature in features:
            atb_similarity = 1 - cosine(feature['ATB'], db_features['ATB'])
            rtb_similarity = 1 - cosine(feature['RTB'], db_features['RTB'])
            ftb_similarity = 1 - cosine(feature['FTB'], db_features['FTB'])
            
            combined_similarity = (0.5 * atb_similarity + 0.3 * rtb_similarity + 0.2 * ftb_similarity)

            similarity.append({
                "Database Entry": idx,
                "ATB Similarity": atb_similarity,
                "RTB Similarity": rtb_similarity,
                "FTB Similarity": ftb_similarity,
                "Combined Similarity": combined_similarity
            })
    
    return similarity

def find_max(similarity):
    if not similarity:
        return None
    
    best = max(similarity, key=lambda x: x["Combined Similarity"])
    return best


# features = [
#     {"ATB": np.array([0.1, 0.2, 0.3, 0.4]), "RTB": np.array([0.1, 0.1, 0.2, 0.3]), "FTB": np.array([0.2, 0.3, 0.4, 0.5])},  # Window 1 dari file acuan
#     {"ATB": np.array([0.2, 0.3, 0.4, 0.5]), "RTB": np.array([0.2, 0.3, 0.4, 0.5]), "FTB": np.array([0.1, 0.2, 0.3, 0.4])},  # Window 2 dari file acuan
#     {"ATB": np.array([0.3, 0.4, 0.5, 0.6]), "RTB": np.array([0.3, 0.4, 0.5, 0.6]), "FTB": np.array([0.2, 0.3, 0.4, 0.5])},  # Window 3 dari file acuan
# ]

# database = [

#     {"ATB": np.array([0.1, 0.2, 0.3, 0.4]), "RTB": np.array([0.1, 0.1, 0.2, 0.3]), "FTB": np.array([0.2, 0.3, 0.4, 0.5])},  # Window 1 dari database
#     {"ATB": np.array([0.5, 0.6, 0.7, 0.8]), "RTB": np.array([0.5, 0.6, 0.7, 0.8]), "FTB": np.array([0.3, 0.4, 0.5, 0.6])},  # Window 2 dari database
#     {"ATB": np.array([0.2, 0.3, 0.4, 0.5]), "RTB": np.array([0.2, 0.3, 0.4, 0.5]), "FTB": np.array([0.1, 0.2, 0.3, 0.4])},  # Window 3 dari database
# ]

# similar = similarity_calculator(features,database)

# for sim in similar:
#     print(sim)

# print("yang paling deket:\n")
# print(find_max(similar))