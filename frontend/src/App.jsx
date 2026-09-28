import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Percent, ShoppingBag, 
  BarChart2, PieChart, Users, Cpu, ShieldAlert, CheckCircle2, 
  Sliders, FileText, RefreshCw, AlertCircle, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

const API_BASE = 'http://localhost:5001';

export default function App() {
  const [activeTab, setActiveTab] = useState('insights');
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [financials, setFinancials] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [mlData, setMlData] = useState(null);
  const [actionPlan, setActionPlan] = useState([]);
  const [datasetSample, setDatasetSample] = useState(null);

  // Simulator State
  const [simCategory, setSimCategory] = useState('Electronics');
  const [simPrice, setSimPrice] = useState(350);
  const [simDiscount, setSimDiscount] = useState(25);
  const [simQuantity, setSimQuantity] = useState(3);
  const [simLogistics, setSimLogistics] = useState(7.41);
  const [simResult, setSimResult] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [ovRes, finRes, custRes, mlRes, actRes, dsRes] = await Promise.all([
        fetch(`${API_BASE}/api/overview`),
        fetch(`${API_BASE}/api/financial-analysis`),
        fetch(`${API_BASE}/api/customer-behavior`),
        fetch(`${API_BASE}/api/ml/evaluation`),
        fetch(`${API_BASE}/api/action-plan`),
        fetch(`${API_BASE}/api/dataset-sample?limit=50`)
      ]);

      if (ovRes.ok) setOverview(await ovRes.json());
      if (finRes.ok) setFinancials(await finRes.json());
      if (custRes.ok) setCustomerData(await custRes.json());
      if (mlRes.ok) setMlData(await mlRes.json());
      if (actRes.ok) setActionPlan(await actRes.json());
      if (dsRes.ok) setDatasetSample(await dsRes.json());
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const runSimulation = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/ml/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: simCategory,
          original_price: parseFloat(simPrice),
          discount: parseFloat(simDiscount) / 100.0,
          quantity: parseInt(simQuantity),
          logistics_cost: parseFloat(simLogistics)
        })
      });
      if (res.ok) {
        setSimResult(await res.json());
      }
    } catch (err) {
      console.error("Simulation error:", err);
    }
  };

  useEffect(() => {
    runSimulation();
  }, [simCategory, simPrice, simDiscount, simQuantity, simLogistics]);

  // Clean 7 Insights Data (Numbers + Status + Action, Zero Paragraphs)
  const cleanInsights = [
    {
      id: 1,
      metric: "Volume Elasticity",
      value: "3.01 vs 3.05 units",
      change: "Flat (ε ≈ 0.01)",
      status: "Inelastic",
      statusType: "danger",
      action: "Require quantity hurdles (Buy 3 Get 15%)"
    },
    {
      id: 2,
      metric: "Electronics at 30% Off",
      value: "-$7.51 / order",
      change: "-102.8% margin",
      status: "Loss-Making",
      statusType: "danger",
      action: "Cap maximum discount at 10%"
    },
    {
      id: 3,
      metric: "Discount Profit Penalty",
      value: "-$132.31 / order",
      change: "$437 full vs $305 promo",
      status: "-30.2% Profit",
      statusType: "danger",
      action: "Eliminate universal storewide markdowns"
    },
    {
      id: 4,
      metric: "Total Conceded Margin",
      value: "$6.78 Million",
      change: "59.8% orders discounted",
      status: "Margin Drain",
      statusType: "danger",
      action: "Shift discount budget to high-margin categories"
    },
    {
      id: 5,
      metric: "Books & Apparel Resilience",
      value: "+$287 to $358 / order",
      change: "40-45% low COGS",
      status: "Profitable",
      statusType: "success",
      action: "Safe to promote up to 25%"
    },
    {
      id: 6,
      metric: "Promo Buyer Behavior",
      value: "62% Deal Chasers",
      change: "Never buy full price",
      status: "High Churn",
      statusType: "warning",
      action: "Gate discounts behind VIP loyalty tiers"
    },
    {
      id: 7,
      metric: "Regression Profit Drag",
      value: "-$65.82 / 10% discount",
      change: "R² = 0.8339",
      status: "Linear Loss",
      statusType: "danger",
      action: "Simulate discount limits before launch"
    }
  ];

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="brand-wrapper">
            <div className="brand-icon">
              <TrendingUp size={18} />
            </div>
            <div>
              <div className="brand-title">E-Commerce Discount & Profitability Intelligence</div>
              <div className="brand-subtitle">DS_Day01_15 • 100,000 Orders</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span className="badge-tag">Linear Regression (R² = 0.834)</span>
            <span className="badge-tag" style={{ background: '#ECFDF5', color: '#059669', borderColor: '#A7F3D0' }}>
              Verified Data
            </span>
          </div>
        </div>
      </header>

      {/* KPI Ribbon */}
      {overview && (
        <section className="kpi-ribbon">
          <div className="kpi-grid">
            <div className="kpi-card">
              <span className="kpi-label"><DollarSign size={13} /> Net Revenue</span>
              <span className="kpi-value">${(overview.total_net_revenue / 1000000).toFixed(1)}M</span>
              <span className="kpi-subtext">Avg ${(overview.avg_order_value).toFixed(1)} / order</span>
            </div>

            <div className="kpi-card highlight-success">
              <span className="kpi-label"><TrendingUp size={13} /> Contribution Margin</span>
              <span className="kpi-value">${(overview.total_contribution_margin / 1000000).toFixed(1)}M</span>
              <span className="kpi-subtext">{overview.overall_margin_rate.toFixed(1)}% margin rate</span>
            </div>

            <div className="kpi-card highlight-danger">
              <span className="kpi-label"><Percent size={13} /> Discounts Given</span>
              <span className="kpi-value">${(overview.total_discount_dollars_lost / 1000000).toFixed(2)}M</span>
              <span className="kpi-subtext">{overview.discounted_orders_pct.toFixed(1)}% of all orders</span>
            </div>

            <div className="kpi-card">
              <span className="kpi-label"><ShoppingBag size={13} /> Basket Volume</span>
              <span className="kpi-value">{overview.avg_quantity_per_order.toFixed(2)} units</span>
              <span className="kpi-subtext" style={{ color: '#DC2626' }}>Zero elasticity (flat)</span>
            </div>

            <div className="kpi-card">
              <span className="kpi-label"><ShieldAlert size={13} /> Electronics Risk</span>
              <span className="kpi-value" style={{ color: '#DC2626' }}>-$7.51</span>
              <span className="kpi-subtext">Loss at 30% discount</span>
            </div>
          </div>
        </section>
      )}

      {/* Tab Navigation */}
      <nav className="tabs-bar">
        <div className="tabs-wrapper">
          <button 
            className={`tab-btn ${activeTab === 'insights' ? 'active' : ''}`}
            onClick={() => setActiveTab('insights')}
          >
            Insights Summary
          </button>

          <button 
            className={`tab-btn ${activeTab === 'visualizations' ? 'active' : ''}`}
            onClick={() => setActiveTab('visualizations')}
          >
            4 Visualisations
          </button>

          <button 
            className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            Category Profitability
          </button>

          <button 
            className={`tab-btn ${activeTab === 'elasticity' ? 'active' : ''}`}
            onClick={() => setActiveTab('elasticity')}
          >
            Volume Elasticity
          </button>

          <button 
            className={`tab-btn ${activeTab === 'customers' ? 'active' : ''}`}
            onClick={() => setActiveTab('customers')}
          >
            Customer Journey
          </button>

          <button 
            className={`tab-btn ${activeTab === 'ml' ? 'active' : ''}`}
            onClick={() => setActiveTab('ml')}
          >
            Model & Simulator
          </button>

          <button 
            className={`tab-btn ${activeTab === 'action_plan' ? 'active' : ''}`}
            onClick={() => setActiveTab('action_plan')}
          >
            Action Plan
          </button>

          <button 
            className={`tab-btn ${activeTab === 'dataset' ? 'active' : ''}`}
            onClick={() => setActiveTab('dataset')}
          >
            Dataset
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
            <RefreshCw className="spin" size={24} style={{ marginBottom: '0.5rem' }} />
            <div>Loading data...</div>
          </div>
        )}

        {!loading && (
          <>
            {/* TAB 1: INSIGHTS (CLEAN TABLE / LIST - ZERO PARAGRAPH TEXT) */}
            {activeTab === 'insights' && (
              <div className="white-panel">
                <div className="panel-header">
                  <h2 className="panel-title">Key Insights & Empirical Findings</h2>
                  <span className="badge-critical insight-badge">Verdict: Discounts Do Not Increase Profit</span>
                </div>

                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Finding</th>
                        <th>Empirical Metric</th>
                        <th>Observation</th>
                        <th>Status</th>
                        <th>Prescriptive Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cleanInsights.map((item) => (
                        <tr key={item.id}>
                          <td style={{ color: 'var(--text-muted)', fontWeight: '600', width: '40px' }}>#{item.id}</td>
                          <td style={{ fontWeight: '600' }}>{item.metric}</td>
                          <td className="number-cell" style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                            {item.value}
                          </td>
                          <td style={{ color: 'var(--text-secondary)' }}>{item.change}</td>
                          <td>
                            <span className={`insight-badge ${item.statusType === 'danger' ? 'badge-critical' : (item.statusType === 'warning' ? 'badge-risk' : 'badge-opportunity')}`}>
                              {item.status}
                            </span>
                          </td>
                          <td style={{ fontWeight: '500', color: 'var(--accent-blue)' }}>
                            {item.action}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: 4 CORE VISUALIZATIONS */}
            {activeTab === 'visualizations' && (
              <div className="vis-grid">
                <div className="vis-card">
                  <div className="insight-top">
                    <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>1. Margin vs Discount by Category</span>
                    <span className="badge-critical insight-badge">Electronics Loss (-$7.51)</span>
                  </div>
                  <div className="vis-image-container">
                    <img src={`${API_BASE}/visualizations/vis1_margin_vs_discount_by_category.png`} alt="Vis 1" className="vis-image" />
                  </div>
                </div>

                <div className="vis-card">
                  <div className="insight-top">
                    <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>2. Sales Volume vs Discount Rate</span>
                    <span className="badge-critical insight-badge">Inelastic (Flat ~3.0 Units)</span>
                  </div>
                  <div className="vis-image-container">
                    <img src={`${API_BASE}/visualizations/vis2_volume_vs_discount_elasticity.png`} alt="Vis 2" className="vis-image" />
                  </div>
                </div>

                <div className="vis-card">
                  <div className="insight-top">
                    <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>3. Full Price vs Discounted Orders</span>
                    <span className="badge-risk insight-badge">-$132.31 Margin Penalty</span>
                  </div>
                  <div className="vis-image-container">
                    <img src={`${API_BASE}/visualizations/vis3_discounted_vs_nondiscounted_comparison.png`} alt="Vis 3" className="vis-image" />
                  </div>
                </div>

                <div className="vis-card">
                  <div className="insight-top">
                    <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>4. Customer Order Margin by Type</span>
                    <span className="badge-proof insight-badge">Loyal $437 vs Promo $305</span>
                  </div>
                  <div className="vis-image-container">
                    <img src={`${API_BASE}/visualizations/vis4_customer_journey_margin.png`} alt="Vis 4" className="vis-image" />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CATEGORY PROFITABILITY */}
            {activeTab === 'categories' && financials && (
              <div className="white-panel">
                <div className="panel-header">
                  <h2 className="panel-title">Category Profitability Matrix</h2>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Useful vs Margin-Destroying</span>
                </div>

                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>COGS</th>
                        <th>Orders</th>
                        <th>Full Price Margin</th>
                        <th>25%+ Discount Margin</th>
                        <th>Margin Drop</th>
                        <th>Total Margin</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {financials.category_profitability.map((cat) => (
                        <tr key={cat.Product_Category}>
                          <td style={{ fontWeight: '600' }}>{cat.Product_Category}</td>
                          <td className="number-cell">{(cat.COGS_Rate * 100).toFixed(0)}%</td>
                          <td className="number-cell">{cat.Total_Orders.toLocaleString()}</td>
                          <td className="number-cell profit-positive">${cat.Full_Price_Mean_Margin.toFixed(2)}</td>
                          <td className={`number-cell ${cat.Max_Discount_Mean_Margin < 50 ? 'loss-negative' : 'profit-positive'}`}>
                            ${cat.Max_Discount_Mean_Margin.toFixed(2)}
                          </td>
                          <td className="number-cell loss-negative">-{cat.Margin_Drop_Pct.toFixed(1)}%</td>
                          <td className="number-cell">${(cat.Total_Margin / 1000000).toFixed(2)}M</td>
                          <td>
                            <span className={`insight-badge ${cat.Product_Category === 'Electronics' ? 'badge-critical' : (cat.COGS_Rate <= 0.45 ? 'badge-opportunity' : 'badge-risk')}`}>
                              {cat.Recommendation}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: VOLUME ELASTICITY */}
            {activeTab === 'elasticity' && financials && (
              <div className="white-panel">
                <div className="panel-header">
                  <h2 className="panel-title">Volume Elasticity by Discount Tier</h2>
                  <span className="badge-critical insight-badge">Flat Elasticity (ε ≈ 0.01)</span>
                </div>

                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Discount Tier</th>
                        <th>Orders</th>
                        <th>Mean Quantity</th>
                        <th>Mean Revenue</th>
                        <th>Mean Margin</th>
                        <th>Margin %</th>
                        <th>Loss-Making Orders</th>
                      </tr>
                    </thead>
                    <tbody>
                      {financials.volume_elasticity.map((tier) => (
                        <tr key={tier.Discount_Tier}>
                          <td style={{ fontWeight: '600' }}>{tier.Discount_Tier}</td>
                          <td className="number-cell">{tier.Order_Count.toLocaleString()}</td>
                          <td className="number-cell" style={{ fontWeight: '700', color: 'var(--accent-blue)' }}>
                            {tier.Mean_Quantity.toFixed(2)} units
                          </td>
                          <td className="number-cell">${tier.Mean_Revenue.toFixed(2)}</td>
                          <td className={`number-cell ${tier.Mean_Margin < 200 ? 'loss-negative' : 'profit-positive'}`}>
                            ${tier.Mean_Margin.toFixed(2)}
                          </td>
                          <td className="number-cell">{tier.Margin_Rate_Pct.toFixed(1)}%</td>
                          <td className="number-cell">
                            {tier.Negative_Margin_Orders > 0 ? (
                              <span style={{ color: '#DC2626', fontWeight: '700' }}>
                                {tier.Negative_Margin_Orders} ({tier.Negative_Margin_Pct.toFixed(1)}%)
                              </span>
                            ) : (
                              <span style={{ color: '#059669' }}>0</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 5: CUSTOMER JOURNEY */}
            {activeTab === 'customers' && customerData && (
              <div>
                <div className="white-panel">
                  <div className="panel-header">
                    <h2 className="panel-title">Customer Order Behavior Across Stages</h2>
                  </div>
                  <div className="table-wrapper">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Stage</th>
                          <th>Orders</th>
                          <th>Customers</th>
                          <th>Mean Revenue</th>
                          <th>Mean Margin</th>
                          <th>Margin %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customerData.journey.map((j) => (
                          <tr key={j.Customer_Journey_Stage}>
                            <td style={{ fontWeight: '600' }}>{j.Customer_Journey_Stage}</td>
                            <td className="number-cell">{j.Order_Count.toLocaleString()}</td>
                            <td className="number-cell">{j.Unique_Customers.toLocaleString()}</td>
                            <td className="number-cell">${j.Mean_Order_Revenue.toFixed(2)}</td>
                            <td className={`number-cell ${j.Mean_Margin < 350 ? 'loss-negative' : 'profit-positive'}`}>
                              ${j.Mean_Margin.toFixed(2)}
                            </td>
                            <td className="number-cell">{j.Margin_Rate_Pct.toFixed(1)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="white-panel">
                  <div className="panel-header">
                    <h2 className="panel-title">Customer Segments</h2>
                  </div>
                  <div className="table-wrapper">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Segment</th>
                          <th>Customers</th>
                          <th>Orders/Cust</th>
                          <th>Mean LTV Revenue</th>
                          <th>Mean LTV Margin</th>
                          <th>Total Margin</th>
                          <th>Share</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customerData.segments.map((seg) => (
                          <tr key={seg.Segment}>
                            <td style={{ fontWeight: '600' }}>{seg.Segment}</td>
                            <td className="number-cell">{seg.Customer_Count.toLocaleString()}</td>
                            <td className="number-cell">{seg.Mean_Orders.toFixed(2)}</td>
                            <td className="number-cell">${seg.Mean_LTV_Revenue.toFixed(2)}</td>
                            <td className="number-cell profit-positive">${seg.Mean_LTV_Margin.toFixed(2)}</td>
                            <td className="number-cell">${(seg.Total_Segment_Margin / 1000000).toFixed(2)}M</td>
                            <td className="number-cell" style={{ fontWeight: '700' }}>{seg.Margin_Share_Pct.toFixed(1)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: MACHINE LEARNING & SIMULATOR */}
            {activeTab === 'ml' && mlData && (
              <div>
                <div className="white-panel">
                  <div className="panel-header">
                    <h2 className="panel-title">Linear Regression Model Evaluation</h2>
                    <span className="badge-tag">R² = {mlData.r2_test.toFixed(4)} | MAE = ${mlData.mae_test.toFixed(2)}</span>
                  </div>

                  <div className="table-wrapper">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Feature</th>
                          <th>Coefficient (β)</th>
                          <th>Marginal Effect</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mlData.coefficients.slice(0, 6).map((c) => (
                          <tr key={c.feature}>
                            <td style={{ fontWeight: '600', fontFamily: 'var(--font-mono)' }}>{c.feature}</td>
                            <td className={`number-cell ${c.coefficient >= 0 ? 'profit-positive' : 'loss-negative'}`}>
                              {c.coefficient >= 0 ? `+${c.coefficient.toFixed(2)}` : c.coefficient.toFixed(2)}
                            </td>
                            <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                              {c.feature === 'Discount' && '-$65.82 profit per 10% discount'}
                              {c.feature === 'Quantity' && '+$124.87 gross profit per unit'}
                              {c.feature === 'Original_Price' && '+$1.22 profit per dollar list price'}
                              {c.feature.includes('Books') && 'Highest baseline cushion (COGS 40%)'}
                              {c.feature.includes('Clothing') && 'Strong resilience (COGS 45%)'}
                              {c.feature === 'Logistics_Cost' && '-$1.00 dollar-for-dollar cost'}
                              {!['Discount', 'Quantity', 'Original_Price', 'Logistics_Cost'].includes(c.feature) && !c.feature.includes('Books') && !c.feature.includes('Clothing') && 'Category adjustment'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* SIMULATOR */}
                <div className="white-panel">
                  <div className="panel-header">
                    <h2 className="panel-title">Live Profit Simulator</h2>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>What-If Predictor</span>
                  </div>

                  <div className="simulator-container">
                    <div className="simulator-form">
                      <div className="form-group">
                        <label className="form-label">Category</label>
                        <select className="form-select" value={simCategory} onChange={(e) => setSimCategory(e.target.value)}>
                          <option value="Electronics">Electronics (COGS 70%)</option>
                          <option value="Sports & Outdoors">Sports & Outdoors (COGS 52%)</option>
                          <option value="Home & Kitchen">Home & Kitchen (COGS 50%)</option>
                          <option value="Toys & Games">Toys & Games (COGS 48%)</option>
                          <option value="Clothing">Clothing (COGS 45%)</option>
                          <option value="Books">Books (COGS 40%)</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          <span>Original Price</span>
                          <span style={{ fontFamily: 'var(--font-mono)' }}>${simPrice}</span>
                        </label>
                        <input type="range" min="20" max="600" step="10" value={simPrice} className="range-slider" onChange={(e) => setSimPrice(e.target.value)} />
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          <span>Discount</span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: simDiscount > 20 ? '#DC2626' : 'var(--text-primary)' }}>{simDiscount}%</span>
                        </label>
                        <input type="range" min="0" max="40" step="5" value={simDiscount} className="range-slider" onChange={(e) => setSimDiscount(e.target.value)} />
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          <span>Quantity</span>
                          <span style={{ fontFamily: 'var(--font-mono)' }}>{simQuantity} units</span>
                        </label>
                        <input type="range" min="1" max="10" step="1" value={simQuantity} className="range-slider" onChange={(e) => setSimQuantity(e.target.value)} />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Logistics Cost ($)</label>
                        <input type="number" className="form-input" value={simLogistics} step="0.5" onChange={(e) => setSimLogistics(e.target.value)} />
                      </div>
                    </div>

                    {simResult && (
                      <div className="simulator-result">
                        <div>
                          <div className={`sim-status-banner ${simResult.status_color}`}>
                            {simResult.status}
                          </div>

                          <div className="sim-metrics-grid">
                            <div className="sim-metric-box">
                              <div className="label">Revenue</div>
                              <div className="val">${simResult.financial_breakdown.revenue.toFixed(2)}</div>
                            </div>

                            <div className="sim-metric-box">
                              <div className="label">Discount Loss</div>
                              <div className="val" style={{ color: '#DC2626' }}>
                                -${simResult.financial_breakdown.discount_dollars_lost.toFixed(2)}
                              </div>
                            </div>

                            <div className="sim-metric-box">
                              <div className="label">Contribution Margin</div>
                              <div className={`val ${simResult.financial_breakdown.exact_contribution_margin < 0 ? 'loss-negative' : 'profit-positive'}`}>
                                ${simResult.financial_breakdown.exact_contribution_margin.toFixed(2)}
                              </div>
                            </div>

                            <div className="sim-metric-box">
                              <div className="label">ML Prediction</div>
                              <div className="val" style={{ color: 'var(--accent-indigo)' }}>
                                ${simResult.ml_model_prediction.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="sim-decision-box">
                          <strong>Rule:</strong> {simResult.recommendation}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: ACTION PLAN */}
            {activeTab === 'action_plan' && (
              <div>
                {actionPlan.map((pillar, idx) => (
                  <div key={idx} className="pillar-card">
                    <div className="pillar-header">
                      <span className="badge-tag">Pillar {idx + 1}</span>
                      <h3 className="pillar-title">{pillar.pillar}</h3>
                    </div>
                    <div className="actions-list">
                      {pillar.actions.map((act, aIdx) => (
                        <div key={aIdx} className="action-item">
                          <div className="action-category">{act.category}</div>
                          <div className="action-rule">{act.rule}</div>
                          <div className="action-benefit">{act.expected_benefit}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 8: DATASET */}
            {activeTab === 'dataset' && datasetSample && (
              <div className="white-panel">
                <div className="panel-header">
                  <h2 className="panel-title">Cleaned Dataset (50 Row Preview)</h2>
                  <span className="badge-tag">100,000 Records</span>
                </div>

                <div className="table-wrapper" style={{ maxHeight: '550px', overflowY: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Category</th>
                        <th>Original Price</th>
                        <th>Discount</th>
                        <th>Selling Price</th>
                        <th>Qty</th>
                        <th>Logistics</th>
                        <th>Revenue</th>
                        <th>Contribution Margin</th>
                        <th>Margin %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {datasetSample.data.map((row) => (
                        <tr key={row.Order_ID}>
                          <td style={{ fontFamily: 'var(--font-mono)' }}>{row.Order_ID}</td>
                          <td>{row.Product_Category}</td>
                          <td className="number-cell">${row.Original_Price.toFixed(2)}</td>
                          <td className="number-cell" style={{ color: row.Discount > 0 ? '#DC2626' : 'var(--text-muted)' }}>
                            {(row.Discount * 100).toFixed(0)}%
                          </td>
                          <td className="number-cell">${row.Selling_Price.toFixed(2)}</td>
                          <td className="number-cell">{row.Quantity}</td>
                          <td className="number-cell">${row.Logistics_Cost.toFixed(2)}</td>
                          <td className="number-cell">${row.Revenue.toFixed(2)}</td>
                          <td className={`number-cell ${row.Estimated_Contribution_Margin < 0 ? 'loss-negative' : 'profit-positive'}`}>
                            ${row.Estimated_Contribution_Margin.toFixed(2)}
                          </td>
                          <td className="number-cell">{row.Contribution_Margin_Pct.toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="footer">
        DS_Day01_15 • E-Commerce Discount & Profitability Intelligence
      </footer>
    </div>
  );
}
