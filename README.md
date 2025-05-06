# 💼 InvestMate: Navigate Your Financial Future With Confidence

InvestMate is a robust financial management and investment guidance platform built using **Next.js (Frontend)** and **Flask (Backend)**. It empowers users to understand, track, and plan their finances through **AI-driven predictions**, **explainable insights**, and **personalized investment recommendations**.

---

## 🚀 Features

### 📊 1. Expense Tracking & Visualization
- Input daily **income**, **spending**, and **salary**.
- Get visual insights via **dynamic graphs**.
- Category-wise breakdowns of **savings**, **expenses**, and more.
- Integrated with **financialnews.api** for real-time financial news.

### 📈 2. Stock Market Price Prediction
- Trained on 72+ stocks using ML models:
  - **LSTM (Best)**
  - LSTM, GRU, BiLSTM, ConvLSTM
- Sliding window prediction with 60-day lookback.
- Graphs: **Actual vs Predicted Prices**.

![image](https://github.com/user-attachments/assets/a8e303fa-099f-47d2-8986-7b788023881c)

### 🪙 3. Gold ETFs Price Forecast
- Features 80 economic indicators (excluding GLD ETF's 'Close').
- Target: `Adj Close` of GLD ETF.
- Models: `LassoCV`, `RidgeCV`, `Bayesian Ridge`, `SVR`, `Random Forest Regressor`, `GBR`, `SGD`  and ensemble models.
- Visual insights to recommend best buy/sell timings.
  
![image](https://github.com/user-attachments/assets/e5fad368-82f9-43ef-a52f-5d37253ae096)

### 📉 4. Mutual Funds Forecast
- 52 mutual fund types evaluated.
- Supports multiple regression-based ML models.
- Graphical comparison of **actual vs. predicted NAVs**.

![image](https://github.com/user-attachments/assets/b64d7852-578f-41a8-a5f1-d3fdcbed9d71)

### 🤖 5. Investment Recommendation + Risk Segregation
- **Collaborative filtering** algorithm tailored by:
  - Age, salary, existing loans, risk appetite.
- Suggests **customized portfolio allocation**.
- Combined UI + backend experience for a seamless decision-making process.

![image](https://github.com/user-attachments/assets/69ce12d9-d03f-4430-8e24-e1ab83016147)


### 🧠 6. Finance-Specific Chatbot with RAG (Retrieval-Augmented Generation)
- Built using **LLaMA-based LLM** fine-tuned for **Indian finance**.
- Retrieves factual data + generates logical explanations.
- Integrated Explainable AI (XAI) via Gemini API for:
  - Risk insights
  - Portfolio reasoning
  - Trustworthy interactions
  
![image](https://github.com/user-attachments/assets/3ad6726f-a31b-431c-b907-08fe369cf5ea)

---

## 🛠 Tech Stack

| Frontend | Backend | ML Models | Tools/APIs |
|----------|---------|-----------|------------|
| Next.js  | Flask   | SVR, Ensemble Learning, LSTM, RidgeCV, etc. | FinancialNews API, Gemini, LLaMA, Scikit-learn, TensorFlow |

---

## 📦 Installation Guide

### 1. Clone the Repository
```bash
git clone https://github.com/KhotSharli/InvestMate.git
```

### 2. Frontend Setup 
```bash
cd my-app
npm install
npm run dev
```

### 3. Backend Setup 
```bash
1)
cd my-app
pip install -r requirements.txt

2)
cd my-app\app\`(dashboard`)
pyton app.py

3)
cd my-app\app\`(dashboard`)\ask-gemini
pyton app.py

4)
cd my-app\app\`(dashboard`)\gold
pyton app.py

5)
cd my-app\app\`(dashboard`)\MF
pyton app.py

6)
cd my-app\app\`(dashboard`)\stockmarket
pyton app.py

```
## 📦Drive Resources
📁 Trained ML Models & Weights for Stocks: [Download Here](https://drive.google.com/drive/folders/1PbRuuUGri7rPg2jWpYWpDOY6St1Djro0)

📁 Input file for RAG : [Download Here](https://drive.google.com/drive/folders/1OMBsL5-cZvvFF8emnOrIdlhyEjtDU6w5)

📁 Final Project Report & Presentation: [Access Here](https://drive.google.com/drive/folders/1HdhgpD5EGJQ38h9yFehaBeGo4G1w8ASZ)
