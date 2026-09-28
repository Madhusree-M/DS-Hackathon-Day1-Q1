# E-Commerce: Does Discount Really Increase Profit?
### Data Science Hackathon Challenge — `DS_Day01_15`

An end-to-end econometric data science system and interactive web application evaluating order-level unit economics, customer journey behavior, and Linear Regression profit modeling across 100,000 retail transactions.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python**: 3.10 or higher
- **Node.js**: v18 or higher (npm included)

---

### Step 1: Run the Backend (Python Flask API)

1. Open a terminal and navigate to the project directory:
   ```bash
   cd "/Users/madhusree/Documents/VSCode/Datascience Hackathon"
   ```

2. (Optional) Run the Data Science Pipeline (to re-generate calculations, datasets, and visualizations):
   ```bash
   python3 backend/data_pipeline.py
   ```

3. Start the Flask Backend Server (runs on port **5001**):
   ```bash
   python3 backend/server.py
   ```

   *Verify backend is active:* Open [http://localhost:5001/api/health](http://localhost:5001/api/health) in your browser.

---

### Step 2: Run the Frontend (React.js + Vite)

1. Open a **new / second terminal** window:
   ```bash
   cd "/Users/madhusree/Documents/VSCode/Datascience Hackathon/frontend"
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the Vite React development server:
   ```bash
   npm run dev
   ```

4. Open your web browser and navigate to:
   👉 **[http://localhost:3000](http://localhost:3000)**

---

## 📊 What's Included in the Web Application

- **Executive KPI Ribbon:** Real-time metrics on Net Revenue, Contribution Margin, Margin %, Total Discount Loss, and Elasticity.
- **7 Key Insights:** Data-backed findings answering the management question: *"Does discount really increase profit?"* (Verdict: **NO**).
- **4 Core Visualisations:**
  1. *Contribution Margin vs Discount Tier across Categories* (Highlights Electronics margin collapse below $0 break-even).
  2. *Sales Volume (Quantity) vs Discount Elasticity* (Proves zero elasticity $\varepsilon \approx 0.01$, flat at ~3.0 units across all discounts).
  3. *Discounted vs Full-Price Sales Performance* ($437.58 full price vs $305.27 discounted margin).
  4. *Customer Journey Margins* (Before, during, and after promotion behavior).
- **Category Profitability Deep-Dive:** Interactive matrix identifying discount-useful vs margin-destroying categories.
- **Volume Elasticity Analyzer:** Verification that high markdowns fail to produce volume uplift.
- **Customer Pre/Post Promo Analysis:** Customer loyalty segments and lifetime contribution margin tracking.
- **Linear Regression & Live What-If Simulator:**
  - Ordinary Least Squares model ($R^2 = 0.8339$, MAE = $99.13).
  - Interactive simulator: Adjust Category, Price, Discount %, Quantity, and Logistics to predict profit and get instant prescriptive approval/rejection.
- **Practical Action Plan:** 4-pillar strategic discount framework.
- **Cleaned Dataset Explorer:** Sample table previewing verified records.

---

## 📁 Repository Structure

```text
├── Amazon.csv                             # Raw 100,000 order dataset
├── cleaned_ecommerce_dataset.csv          # Cleaned dataset matching challenge schema
├── backend/
│   ├── data_pipeline.py                   # Data cleaning, EDA, visualizations, and ML training
│   ├── server.py                          # Flask REST API with live ML predictor
│   └── analysis_results.json              # Precomputed analysis cache
├── frontend/
│   ├── src/
│   │   ├── App.jsx                        # Main React application & dashboard tabs
│   │   ├── index.css                      # Custom dark glassmorphism design system
│   │   └── main.jsx                       # Vite entry point
│   ├── package.json                       # Dependencies & scripts
│   └── vite.config.js                     # Configured for port 3000
└── visualizations/
    ├── vis1_margin_vs_discount_by_category.png
    ├── vis2_volume_vs_discount_elasticity.png
    ├── vis3_discounted_vs_nondiscounted_comparison.png
    └── vis4_customer_journey_margin.png
```

---

## 🛠️ API Reference (Backend)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Healthcheck and record count |
| `GET` | `/api/overview` | KPI summaries ($84.2M Revenue, $37.2M Margin, etc.) |
| `GET` | `/api/insights` | 7 key data science insights with stats and implications |
| `GET` | `/api/financial-analysis` | Category matrix, elasticity, and discount comparisons |
| `GET` | `/api/customer-behavior` | Customer journey stages & customer LTV segments |
| `GET` | `/api/ml/evaluation` | Linear regression $R^2$, RMSE, MAE, and feature coefficients |
| `POST` | `/api/ml/predict` | Real-time what-if profit prediction & approval engine |
| `GET` | `/api/dataset-sample` | Cleaned dataset records (50-row preview) |
