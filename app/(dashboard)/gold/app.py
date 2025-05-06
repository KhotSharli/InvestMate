from flask import Flask, jsonify
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def load_data(file_path):
    try:
        df = pd.read_csv(file_path)
        if "Date" not in df.columns or "price" not in df.columns:
            raise ValueError(f"{file_path} must contain 'Date' and 'price' columns.")
        df['Date'] = pd.to_datetime(df['Date'], format='%d-%m-%Y')
        df["price"] = pd.to_numeric(df["price"], errors='coerce').fillna(0)
        return df
    except Exception as e:
        print(f"❗ Error loading {file_path}: {e}")
        return pd.DataFrame(columns=["Date", "price"])

historical_df = load_data("actual_prices.csv")
predicted_df = load_data("predicted_prices.csv")

# API Endpoint
@app.route("/api/gold_prices", methods=["GET"])
def get_gold_prices():
    return jsonify({
        "historical_data": historical_df.to_dict(orient="records"),
        "future_predictions": predicted_df.to_dict(orient="records"),
    })

if __name__ == "__main__":
    app.run(debug=True)
