from flask import Flask, request, jsonify, render_template
import json
import sys
import os

# Add the tenents directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'tenents'))

# Import the analysis functions from read.py
from read import (
    read_json_file, parse_tables_from_json, evaluate_file_variants,
    get_phonetic_simplicity_score, compute_contrastiveness,
    compute_paedagogic_convenience, compute_disambiguity,
    build_score_table, ahp_analysis, apply_ahp_to_operability
)

app = Flask(__name__)

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        # Get the rankings from the request
        rankings = request.json
        
        # Save the rankings to latest_rankings.json
        with open("data/latest_rankings.json", "w") as f:
            json.dump(rankings, f, indent=4)
        
        # Read the way analysis data
        filename = "data/way_analysis.json"
        json_data = read_json_file(filename)
        freq_table, conf_matrix = parse_tables_from_json(json_data)
        
        # Extract IPA words from freq_table (skip header row)
        ipa_words = [row[0] for row in freq_table[1:]]
        
        # Initialize tenet scores
        tenet_scores = {}
        
        # Get target word from rankings
        target_word = rankings["ipa"]["word"]
        
        # Calculate International Acceptance scores
        scores = evaluate_file_variants(target_word, ipa_words)
        tenet_scores['International Acceptance'] = scores
        
        # Calculate Phonetic Simplicity scores
        phonetic_simplicity_scores = {}
        for word in ipa_words:
            score = get_phonetic_simplicity_score(word)
            phonetic_simplicity_scores[word] = score
        tenet_scores['Phonetic Simplicity'] = phonetic_simplicity_scores
        
        # Calculate Frequency scores
        ipa_fraction = {row[0]: float(row[2]) for row in freq_table[1:]}
        tenet_scores['Frequency'] = ipa_fraction
        
        # Calculate Contrastiveness scores
        contrastiveness_scores = compute_contrastiveness(ipa_words)
        tenet_scores['Contrastiveness'] = contrastiveness_scores
        
        # Calculate Paedagogic Convenience scores
        paedagogic_convenience_scores = {}
        for word in ipa_words:
            score, _ = compute_paedagogic_convenience(word)
            paedagogic_convenience_scores[word] = score
        tenet_scores['Paedagogic Convenience'] = paedagogic_convenience_scores
        
        # Calculate Disambiguity scores
        disambiguity_scores = compute_disambiguity(ipa_words, conf_matrix)
        tenet_scores['Disambiguity'] = disambiguity_scores
        
        # Build score table
        score_table = build_score_table(tenet_scores)
        
        # Run AHP analysis
        full_name = {
            "IA": "International Acceptance",
            "PS": "Phonetic Simplicity",
            "PC": "Paedagogic Convenience",
            "CO": "Contrastiveness",
            "F": "Frequency",
            "DI": "Disambiguity"
        }
        user_input = {full_name[k]: v for k, v in rankings["sliders"].items()}
        result = ahp_analysis(user_input)
        
        # Apply AHP weights
        final_table = apply_ahp_to_operability(score_table, result["weights"])
        
        # Get best transcription
        best_transcription = final_table.index[0]
        best_score = final_table['Weighted Score'].iloc[0]
        
        # Prepare response
        response = {
            "best_transcription": best_transcription,
            "weighted_score": float(best_score),
            "final_table": final_table.to_dict(orient='index'),
            "weights": result["weights"]
        }
        
        # Ensure the final_table is properly formatted
        formatted_table = {}
        for ipa, scores in response["final_table"].items():
            formatted_table[ipa] = {
                k: float(v) if isinstance(v, (int, float)) else v 
                for k, v in scores.items()
            }
        response["final_table"] = formatted_table
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True) 