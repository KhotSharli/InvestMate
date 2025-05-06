from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

# Load Mutual Funds Dataset
df = pd.read_csv("Finally_merged3.csv")
df["date"] = pd.to_datetime(df["date"])

# Load Precomputed Predictions
predictions_file = "mutual_funds_predictions.csv"
if os.path.exists(predictions_file):
    pred_df = pd.read_csv(predictions_file)
else:
    pred_df = None
    print("⚠ No predictions file found!")

@app.route("/get_funds", methods=["GET"])
def get_funds():
    """Return available mutual funds"""
    funds = df["Scheme Code"].unique().tolist()
    return jsonify({"mutual_funds": funds})

@app.route("/get_fund_data", methods=["POST"])
def get_fund_data():
    """Return historical NAV and precomputed predictions"""
    data = request.get_json()
    fund_name = data.get("fund_name", "")

    if fund_name not in df["Scheme Code"].values:
        return jsonify({"error": "Fund not found!"}), 404

    df_fund = df[df["Scheme Code"] == fund_name][["date", "nav"]]

    if pred_df is not None and fund_name in pred_df["Scheme Code"].values:
        fund_predictions = pred_df[pred_df["Scheme Code"] == fund_name][["date", "predicted_nav"]]
    else:
        fund_predictions = pd.DataFrame(columns=["date", "predicted_nav"])

    return jsonify({
        "historical_data": df_fund.to_dict(orient="records"),
        "future_predictions": fund_predictions.to_dict(orient="records")
    })

if __name__ == '__main__':
    app.run(debug=True, port=5002)
