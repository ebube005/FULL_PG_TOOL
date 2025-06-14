import logging
import tempfile
import json
import numpy as np
import pandas as pd
import Levenshtein
from collections import Counter
from sklearn.cluster import AgglomerativeClustering
import requests

# API_URL = "https://thebickersteth-voxpreference.hf.space"
API_URL = "http://localhost:8000"
logger = logging.getLogger(__name__)

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

def format_output(variant_counts):
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

async def analyze_audio_and_word(audioFile, target_word):
    logger.info("Starting analysis pipeline")
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
        content = await audioFile.read()
        tmp.write(content)
        tmp_path = tmp.name
    logger.info(f"Saved uploaded audio to {tmp_path}")
    try:
        with open(tmp_path, "rb") as f:
            files = {"audioFile": f}
            logger.info("Sending audio to external API...")
            response = requests.post(API_URL, files=files)
        if response.status_code != 200:
            logger.error(f"API error {response.status_code}: {response.text}")
            return {"success": False, "error": f"API error {response.status_code}: {response.text}"}
        data = response.json()
    except Exception as e:
        logger.exception(f"Failed to fetch data: {e}")
        return {"success": False, "error": str(e)}
    words = [seg['text'].lower() for seg in data.get('segments', []) if seg.get('text')]
    word_cluster_map = cluster_words(words)
    if target_word not in word_cluster_map:
        logger.error(f"'{target_word}' not found in dataset.")
        return {"success": False, "error": f"'{target_word}' not found in dataset."}
    target_cluster = word_cluster_map[target_word]
    ipa_variants = [
        seg['ipa'] for seg in data.get('segments', [])
        if seg.get('ipa') and word_cluster_map.get(seg['text'].lower()) == target_cluster
    ]
    if not ipa_variants:
        logger.error(f"No IPA variants found for cluster containing '{target_word}'.")
        return {"success": False, "error": f"No IPA variants found for cluster containing '{target_word}'."}
    variant_counts = Counter(ipa_variants)
    ipa_list, freq_dict = format_output(variant_counts)
    confusion = generate_confusion_matrix(ipa_list)
    result = {
        "success": True,
        "ipa_variants": [
            {"ipa": ipa, "frequency": freq_dict[ipa]*len(ipa_list), "fraction": freq_dict[ipa]}
            for ipa in ipa_list
        ],
        "confusion_matrix": {
            "labels": ipa_list,
            "matrix": confusion.values.tolist()
        },
    }
    return result

async def get_word_ipa(target_word):
    logger.info(f"Fetching IPA for word: {target_word}")
    try:
        response = requests.post(f"{API_URL}/ipa", data={"word": target_word})
        if response.status_code != 200:
            logger.error(f"IPA API error {response.status_code}: {response.text}")
            return {"success": False, "ipa_error": f"IPA API error {response.status_code}: {response.text}"}
        data = response.json()
        logger.info(f"IPA API response: {data}")
        return {"success": True, "ipa": data.get("ipa"), "ipa_error": data.get("ipa_error")}
    except Exception as e:
        logger.exception(f"Failed to fetch IPA: {e}")
        return {"success": False, "ipa_error": str(e)} 