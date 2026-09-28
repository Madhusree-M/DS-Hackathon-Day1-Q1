import os
import json
import numpy as np
import pandas as pd
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error

app = Flask(__name__, static_folder='../visualizations')
CORS(app)

DATA_PATH = os.path.join(os.path.dirname(__file__), "analysis_results.json")
CLEANED_CSV_PATH = os.path.join(os.path.dirname(__file__), "..", "cleaned_ecommerce_dataset.csv")
VIS_FOLDER = os.path.join(os.path.dirname(__file__), "..", "visualizations")

# Global cache for analysis and model
cached_results = None
lr_model = None
feature_columns = None
cogs_benchmark = {
    'Electronics': 0.70,
    'Clothing': 0.45,
    'Home & Kitchen': 0.50,
    'Books': 0.40,
    'Toys & Games': 0.48,
    'Sports & Outdoors': 0.52
}

def load_or_init():
    global cached_results, lr_model, feature_columns
    if os.path.exists(DATA_PATH):
        with open(DATA_PATH, "r") as f:
            cached_results = json.load(f)
    else:
        from data_pipeline import run_pipeline
        cached_results = run_pipeline()
    
    # Train/load regression model for real-time what-if predictions
    if os.path.exists(CLEANED_CSV_PATH):
        print("Training live regression model from cleaned CSV...")
        df = pd.read_csv(CLEANED_CSV_PATH)
        ml_features = df[['Original_Price', 'Discount', 'Quantity', 'Logistics_Cost', 'Product_Category', 'Promotion_Period']].copy()
        X = pd.get_dummies(ml_features, drop_first=True)
        y = df['Estimated_Contribution_Margin']
        
        lr_model = LinearRegression()
        lr_model.fit(X, y)
        feature_columns = list(X.columns)
        print("Live regression model trained with", len(feature_columns), "features.")

load_or_init()

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "service": "E-Commerce Discount & Profitability Intelligence API",
        "records_processed": cached_results['kpi_overview']['total_orders'] if cached_results else 0
    })

@app.route('/api/overview', methods=['GET'])
def get_overview():
    if not cached_results:
        return jsonify({"error": "Data not initialized"}), 500
    return jsonify(cached_results['kpi_overview'])

@app.route('/api/insights', methods=['GET'])
def get_insights():
    if not cached_results:
        return jsonify({"error": "Data not initialized"}), 500
    return jsonify(cached_results['insights'])

@app.route('/api/financial-analysis', methods=['GET'])
def get_financial_analysis():
    if not cached_results:
        return jsonify({"error": "Data not initialized"}), 500
    return jsonify({
        "comparison": cached_results['comparison_discounted_vs_nondiscounted'],
        "volume_elasticity": cached_results['volume_elasticity'],
        "category_profitability": cached_results['category_profitability'],
        "category_discount_matrix": cached_results['category_discount_matrix']
    })

@app.route('/api/customer-behavior', methods=['GET'])
def get_customer_behavior():
    if not cached_results:
        return jsonify({"error": "Data not initialized"}), 500
    return jsonify({
        "journey": cached_results['customer_journey'],
        "segments": cached_results['customer_segments']
    })

@app.route('/api/ml/evaluation', methods=['GET'])
def get_ml_evaluation():
    if not cached_results:
        return jsonify({"error": "Data not initialized"}), 500
    return jsonify(cached_results['linear_regression'])

@app.route('/api/ml/predict', methods=['POST'])
def predict_margin():
    try:
        data = request.get_json() or {}
        category = data.get('category', 'Electronics')
        original_price = float(data.get('original_price', 300.0))
        discount = float(data.get('discount', 0.15)) # e.g. 0.15 for 15%
        quantity = int(data.get('quantity', 3))
        logistics_cost = float(data.get('logistics_cost', 7.41))
        promo_period = data.get('promo_period', 'Holiday Peak Promo' if discount > 0 else 'Regular Non-Promo')

        # 1. Exact Accounting Formula
        cogs_rate = cogs_benchmark.get(category, 0.50)
        unit_selling_price = original_price * (1.0 - discount)
        revenue = quantity * unit_selling_price
        cogs = quantity * original_price * cogs_rate
        exact_margin = revenue - cogs - logistics_cost
        margin_pct = (exact_margin / revenue * 100.0) if revenue > 0 else 0.0

        # 2. Linear Regression Model Prediction
        ml_prediction = None
        if lr_model and feature_columns:
            # Construct row
            row_dict = {
                'Original_Price': original_price,
                'Discount': discount,
                'Quantity': quantity,
                'Logistics_Cost': logistics_cost,
                'Product_Category': category,
                'Promotion_Period': promo_period
            }
            input_df = pd.DataFrame([row_dict])
            # Dummy encode with same categories
            # Create zeros dataframe with feature_columns
            encoded_row = pd.DataFrame(0.0, index=[0], columns=feature_columns)
            encoded_row['Original_Price'] = original_price
            encoded_row['Discount'] = discount
            encoded_row['Quantity'] = quantity
            encoded_row['Logistics_Cost'] = logistics_cost
            
            cat_col = f"Product_Category_{category}"
            if cat_col in encoded_row.columns:
                encoded_row[cat_col] = 1.0
                
            promo_col = f"Promotion_Period_{promo_period}"
            if promo_col in encoded_row.columns:
                encoded_row[promo_col] = 1.0
                
            pred_val = float(lr_model.predict(encoded_row)[0])
            ml_prediction = round(pred_val, 2)

        # 3. Profitability Status and Prescriptive Recommendation
        if exact_margin < 0:
            status = "Loss-Making (Destructive)"
            status_color = "red"
            recommendation = f"REJECT PROMOTION: This discount yields a net negative margin (-${abs(exact_margin):.2f}). For {category} (COGS {int(cogs_rate*100)}%), maximum allowable discount is {int((1 - cogs_rate - 0.05)*100)}%."
        elif margin_pct < 15.0:
            status = "Low Margin (High Risk)"
            status_color = "amber"
            recommendation = f"CAUTION: Thin margin of {margin_pct:.1f}%. Recommend requiring minimum basket of 4+ units or reducing discount by 5%."
        else:
            status = "Profitable (Accretive)"
            status_color = "green"
            recommendation = f"APPROVED: Healthy contribution margin of ${exact_margin:.2f} ({margin_pct:.1f}%). Safe to launch."

        return jsonify({
            "inputs": {
                "category": category,
                "original_price": original_price,
                "discount": discount,
                "quantity": quantity,
                "logistics_cost": logistics_cost,
                "promo_period": promo_period
            },
            "financial_breakdown": {
                "unit_selling_price": round(unit_selling_price, 2),
                "revenue": round(revenue, 2),
                "cogs": round(cogs, 2),
                "logistics_cost": round(logistics_cost, 2),
                "discount_dollars_lost": round(quantity * original_price * discount, 2),
                "exact_contribution_margin": round(exact_margin, 2),
                "contribution_margin_pct": round(margin_pct, 2)
            },
            "ml_model_prediction": ml_prediction,
            "status": status,
            "status_color": status_color,
            "recommendation": recommendation
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/action-plan', methods=['GET'])
def get_action_plan():
    if not cached_results:
        return jsonify({"error": "Data not initialized"}), 500
    return jsonify(cached_results['action_plan'])

@app.route('/api/dataset-sample', methods=['GET'])
def get_dataset_sample():
    try:
        limit = min(int(request.args.get('limit', 50)), 200)
        df = pd.read_csv(CLEANED_CSV_PATH, nrows=limit)
        return jsonify({
            "total_rows": 100000,
            "sample_rows": len(df),
            "columns": list(df.columns),
            "data": df.to_dict(orient='records')
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/visualizations/<path:filename>')
def serve_visualization(filename):
    return send_from_directory(VIS_FOLDER, filename)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    print(f"Starting E-Commerce Discount API server on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=False)
