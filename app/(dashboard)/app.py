from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import joblib
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load pre-trained models and data
knn = joblib.load('knn_model_new.pkl')
combined_df = pd.read_pickle('combined_df_new.pkl')
investment_clusters = joblib.load('investment_clusters_new.pkl')
expected_columns = joblib.load('expected_columns_new.pkl')
cluster_mapping = joblib.load('cluster_mapping_new.pkl')
scaler = joblib.load('scaler.pkl')
pca = joblib.load('pca.pkl')

def generate_recommendations(user_data):
    """Generates investment recommendations for a given user."""

    user_df = pd.DataFrame([user_data])  # Convert to DataFrame

    # One-hot encoding to match the training setup
    X_user = pd.get_dummies(user_df[['Risk Appetite', 'Term']], prefix=['Risk', 'Term'])
    X_user = X_user.reindex(columns=expected_columns, fill_value=0)

    # Scale and apply PCA
    X_scaled_user = scaler.transform(X_user)
    X_pca_user = pca.transform(X_scaled_user)

    # Nearest neighbor search
    distances, indices = knn.kneighbors(X_scaled_user)
    nearest_investment_indices = indices[0]
    nearest_distances = distances[0]

    # Determine user cluster
    user_cluster = user_df['Risk Appetite'].iloc[0] + ' - ' + user_df['Term'].iloc[0]
    user_cluster_num = cluster_mapping.get(user_cluster)

    # Validate matching investments
    matching_investment_indices = investment_clusters.get(user_cluster_num, [])
    if not matching_investment_indices:
        return []

    matching_investments = []
    for inv_idx, distance in zip(nearest_investment_indices, nearest_distances):
        if inv_idx in matching_investment_indices:
            matching_investments.append({
                'Investment_Name': combined_df.iloc[inv_idx]['Name'],
                'Distance': distance,
                'Investment_Label': combined_df.iloc[inv_idx]['Cluster_Label']
            })

    # Sort and limit to top 5
    matching_investments = sorted(matching_investments, key=lambda x: x['Distance'])[:5]

    # Return only investment names
    return [investment['Investment_Name'] for investment in matching_investments]

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        user_data = request.json
        if not user_data:
            return jsonify({"error": "Invalid input data"}), 400

        recommendations = generate_recommendations(user_data)
        return jsonify({"recommendations": recommendations})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5008)
