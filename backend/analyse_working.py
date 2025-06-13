# This file is deprecated. All logic has been refactored into the FastAPI app (main.py) and supporting modules.

import os
import json
import pandas as pd
import Levenshtein
from collections import Counter
from sklearn.cluster import AgglomerativeClustering
import numpy as np
import requests

API_URL = "https://thebickersteth-voxpreference.hf.space"

def transcribe_and_get_ipa_api(audio_path):
    with open(audio_path, "rb") as f:
        files = {"audioFile": f}
        response = requests.post(API_URL, files=files)
    if response.status_code == 200:
        return response.json()
    else:
        raise ValueError(f"API error {response.status_code}: {response.text}")

def compute_distance_matrix(words):
    size = len(words)
    dist_matrix = np.zeros((size, size))
    for i in range(size):
        for j in range(i + 1, size):
            dist = Levenshtein.distance(words[i], words[j])
            dist_matrix[i, j] = dist_matrix[j, i] = dist
    return dist_matrix

def cluster_words(words, distance_threshold=2.0):
    unique_words = list(set(words))
    distance_matrix = compute_distance_matrix(unique_words)
    clustering = AgglomerativeClustering(
        n_clusters=None,
        metric='precomputed',
        linkage='complete',
        distance_threshold=distance_threshold
    )
    labels = clustering.fit_predict(distance_matrix)
    return dict(zip(unique_words, labels))

def format_output(variant_counts, target_word):
    total = sum(variant_counts.values())
    ipa_variants = list(variant_counts.keys())
    freq_dict = {ipa: round(count / total, 3) for ipa, count in variant_counts.items()}
    return ipa_variants, freq_dict

def generate_confusion_matrix(ipa_variants):
    size = len(ipa_variants)
    matrix = pd.DataFrame(index=ipa_variants, columns=ipa_variants)
    for i in range(size):
        for j in range(size):
            if ipa_variants[i] == ipa_variants[j]:
                matrix.iloc[i, j] = 1.0
            else:
                dist = Levenshtein.distance(ipa_variants[i], ipa_variants[j])
                max_len = max(len(ipa_variants[i]), len(ipa_variants[j]))
                matrix.iloc[i, j] = round(1 - dist / max_len, 2)
    return matrix

def save_result_as_json(ipa_list, freq_dict, matrix, output_path):
    result = {
        "ipa_variants": [
            {"ipa": ipa, "frequency": freq_dict[ipa]*len(ipa_list), "fraction": freq_dict[ipa]}
            for ipa in ipa_list
        ],
        "confusion_matrix": {
            "labels": ipa_list,
            "matrix": matrix.values.tolist()
        }
    }
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print(f"✅ Saved analysis to {output_path}")

if __name__ == "__main__":
    audio_path = input("Enter path to audio file: ").strip()
    target_word = input("Enter target word: ").strip().lower()

    print("📡 Sending audio to API...")
    try:
        data = transcribe_and_get_ipa_api(audio_path)
        with open(f"api_{target_word}.json", "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"✅ API response saved as api_{target_word}.json")
    except Exception as e:
        print(f"❌ Failed to fetch data: {e}")
        exit()

    with open(f"api_{target_word}.json", encoding="utf-8", errors="replace") as f:
        data = json.load(f)

    words = [seg['text'].lower() for seg in data['segments'] if seg.get('text')]
    word_cluster_map = cluster_words(words)

    if target_word not in word_cluster_map:
        print(f"❌ '{target_word}' not found in dataset.")
        exit()

    target_cluster = word_cluster_map[target_word]
    ipa_variants = [
        seg['ipa'] for seg in data['segments']
        if seg.get('ipa') and word_cluster_map.get(seg['text'].lower()) == target_cluster
    ]

    if not ipa_variants:
        print(f"❌ No IPA variants found for cluster containing '{target_word}'.")
        exit()

    variant_counts = Counter(ipa_variants)
    ipa_list, freq_dict = format_output(variant_counts, target_word)
    confusion = generate_confusion_matrix(ipa_list)

    os.makedirs("output", exist_ok=True)
    save_result_as_json(ipa_list, freq_dict, confusion, os.path.join("output", f"{target_word}_analysis.json"))
