from flask import Flask, jsonify, request
import numpy as np
import pandas as pd
import pickle
import os
from sklearn.preprocessing import MinMaxScaler
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

BASE_DIR = "new/"
SEQUENCE_LENGTH = 60

def load_stock_model(stock_name):
    model_file = f"{stock_name}_lstm_model.pkl"
    model_path = os.path.join(BASE_DIR, stock_name, model_file)
    if os.path.exists(model_path):
        with open(model_path, 'rb') as f:
            return pickle.load(f)
    return None

def load_stock_data(stock_name):
    data_file = f"{stock_name}.NS_l.csv"
    data_path = os.path.join(BASE_DIR, stock_name, data_file)
    if os.path.exists(data_path):
        df = pd.read_csv(data_path)
        df.drop(columns=["SO", "EMA"], inplace=True, errors='ignore')
        if "Date" in df.columns:
            df["Date"] = pd.to_datetime(df["Date"], format="%d-%m-%Y", errors='coerce')
            df = df.dropna(subset=["Date"]).set_index("Date")
        return df
    return None

def create_sequences(data, target, sequence_length=60):
    X, y = [], []
    for i in range(len(data) - sequence_length):
        X.append(data[i: i + sequence_length])
        y.append(target[i + sequence_length])
    return np.array(X), np.array(y)

def predict_future(model, last_sequence, scaler, num_features, days=30):
    predictions = []
    current_sequence = last_sequence.copy()
    for _ in range(days):
        pred = model.predict(current_sequence.reshape(1, SEQUENCE_LENGTH, num_features), verbose=0)[0]
        predictions.append(pred)
        current_sequence = np.roll(current_sequence, -1, axis=0)
        current_sequence[-1] = np.append(current_sequence[-1, :-1], pred)
    dummy_features = np.zeros((len(predictions), scaler.n_features_in_ - 1))
    scaled_predictions = np.hstack((dummy_features, np.array(predictions).reshape(-1, 1)))
    return scaler.inverse_transform(scaled_predictions)[:, -1]

@app.route('/predict/<string:stock_name>', methods=['GET'])
def predict(stock_name):
    try:
        model = load_stock_model(stock_name)
        data = load_stock_data(stock_name)
        if model is None:
            return jsonify({"error": f"LSTM model for {stock_name} not found!"}), 404
        if data is None or "CloseNext" not in data.columns:
            return jsonify({"error": f"CSV for {stock_name} is missing 'CloseNext' or could not be loaded."}), 404

        scaler = MinMaxScaler()
        scaled_data = pd.DataFrame(scaler.fit_transform(data), columns=data.columns, index=data.index)

        target_column = "CloseNext"
        features = scaled_data.columns[scaled_data.columns != target_column]
        X, y = create_sequences(scaled_data[features].values, scaled_data[target_column].values, SEQUENCE_LENGTH)

        if len(X) == 0:
            return jsonify({"error": "Not enough data to generate prediction sequences."}), 400

        last_sequence = X[-1]
        future_predictions = predict_future(model, last_sequence, scaler, len(features))

        historical_indices = data.index.strftime('%Y-%m-%d').tolist()
        historical_prices = data['Close'].tolist()

        future_dates = pd.date_range(start=data.index[-1], periods=len(future_predictions)+1, freq='D')[1:]
        future_indices = future_dates.strftime('%Y-%m-%d').tolist()

        return jsonify({
            "historical": {"indices": historical_indices, "prices": historical_prices},
            "predictions": {"indices": future_indices, "prices": future_predictions.tolist()}
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5003)
