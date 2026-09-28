import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Percent, ShoppingBag, 
  BarChart2, PieChart, Users, Cpu, ShieldAlert, CheckCircle2, 
  Sliders, FileText, ArrowRight, RefreshCw, Award, Info
} from 'lucide-react';

const API_BASE = 'http://localhost:5001';

export default function App() {
  const [activeTab, setActiveTab] = useState('insights');
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [insights, setInsights] = useState([]);
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
  const [simPromo, setSimPromo] = useState('Holiday Peak Promo');
  const [simResult, setSimResult] = useState(null);
  const [simLoading, setSimLoading] = useState(false);

  // Fetch initial data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [ovRes, inRes, finRes, custRes, mlRes, actRes, dsRes] = await Promise.all([
        fetch(`${API_BASE}/api/overview`),
        fetch(`${API_BASE}/api/insights`),
        fetch(`${API_BASE}/api/financial-analysis`),
        fetch(`${API_BASE}/api/customer-behavior`),
        fetch(`${API_BASE}/api/ml/evaluation`),
        fetch(`${API_BASE}/api/action-plan`),
        fetch(`${API_BASE}/api/dataset-sample?limit=50`)
      ]);

      if (ovRes.ok) setOverview(await ovRes.json());
      if (inRes.ok) setInsights(await inRes.json());
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

  // Run Simulator Prediction
  const runSimulation = async () => {
    setSimLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/ml/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: simCategory,
          original_price: parseFloat(simPrice),
          discount: parseFloat(simDiscount) / 100.0,
          quantity: parseInt(simQuantity),
          logistics_cost: parseFloat(simLogistics),
          promo_period: simPromo
        })
      });
      if (res.ok) {
        setSimResult(await res.json());
      }
    } catch (err) {
      console.error("Simulation error:", err);
    } finally {
      setSimLoading(false);
    }
  };

  useEffect(() => {
    runSimulation();
  }, [simCategory, simPrice, simDiscount, simQuantity, simLogistics, simPromo]);

  return (
    <div className="app-container">
      {/* Top Header */}
      <header className="header">
        <div className="header-inner">
          <div className="brand-wrapper">
            <div className="brand-icon">
              <TrendingUp size={24} color="#FFFFFF" />
            </div>
            <div>
              <div className="brand-title">E-Commerce Discount & Profitability Intelligence</div>
              <div className="brand-subtitle">Challenge DS_Day01_15 • Empirical Analysis of 100,000 Orders</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span className="badge-tag">Linear Regression ML (R² = 0.834)</span>
            <span className="badge-tag" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
              100k Verified Orders
            </span>
          </div>
        </div>
      </header>

      {/* KPI Metric Ribbon */}
      {overview && (
        <section className="kpi-ribbon">
          <div className="kpi-grid">
            <div className="kpi-card">
              <span className="kpi-label"><DollarSign size={14} /> Total Net Revenue</span>
              <span className="kpi-value">${(overview.total_net_revenue / 1000000).toFixed(1)}M</span>
              <span className="kpi-subtext">Avg ${(overview.avg_order_value).toFixed(1)} / order</span>
            </div>

            <div className="kpi-card highlight-success">
              <span className="kpi-label"><TrendingUp size={14} /> Contribution Margin</span>
              <span className="kpi-value">${(overview.total_contribution_margin / 1000000).toFixed(1)}M</span>
              <span className="kpi-subtext">{overview.overall_margin_rate.toFixed(1)}% margin efficiency</span>
            </div>

            <div className="kpi-card highlight-danger">
              <span className="kpi-label"><Percent size={14} /> Discount Concession Loss</span>
              <span className="kpi-value">${(overview.total_discount_dollars_lost / 1000000).toFixed(2)}M</span>
              <span className="kpi-subtext">{overview.discounted_orders_pct.toFixed(1)}% orders discounted</span>
            </div>

            <div className="kpi-card">
              <span className="kpi-label"><ShoppingBag size={14} /> Basket Scale (Volume)</span>
              <span className="kpi-value">{overview.avg_quantity_per_order.toFixed(2)} units</span>
              <span className="kpi-subtext" style={{ color: '#FB7185' }}>Elasticity ε ≈ 0 (Zero lift)</span>
            </div>

            <div className="kpi-card">
              <span className="kpi-label"><ShieldAlert size={14} /> Electronics Risk</span>
              <span className="kpi-value" style={{ color: '#FB7185' }}>-$7.51</span>
              <span className="kpi-subtext">Margin at 30% discount</span>
            </div>
          </div>
        </section>
      )}

      {/* Tab Bar Navigation */}
      <nav className="tabs-bar">
        <div className="tabs-wrapper">
          <button 
            className={`tab-btn ${activeTab === 'insights' ? 'active' : ''}`}
            onClick={() => setActiveTab('insights')}
          >
            <Award size={16} /> 7 Key Insights
          </button>

          <button 
            className={`tab-btn ${activeTab === 'visualizations' ? 'active' : ''}`}
            onClick={() => setActiveTab('visualizations')}
          >
            <BarChart2 size={16} /> 4 Core Visualisations
          </button>

          <button 
            className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <PieChart size={16} /> Category Profitability
          </button>

          <button 
            className={`tab-btn ${activeTab === 'elasticity' ? 'active' : ''}`}
            onClick={() => setActiveTab('elasticity')}
          >
            <ShoppingBag size={16} /> Volume Elasticity
          </button>

          <button 
            className={`tab-btn ${activeTab === 'customers' ? 'active' : ''}`}
            onClick={() => setActiveTab('customers')}
          >
            <Users size={16} /> Customer Pre/Post Promo
          </button>

          <button 
            className={`tab-btn ${activeTab === 'ml' ? 'active' : ''}`}
            onClick={() => setActiveTab('ml')}
          >
            <Cpu size={16} /> Linear Regression & Simulator
          </button>

          <button 
            className={`tab-btn ${activeTab === 'action_plan' ? 'active' : ''}`}
            onClick={() => setActiveTab('action_plan')}
          >
            <CheckCircle2 size={16} /> Practical Action Plan
          </button>

          <button 
            className={`tab-btn ${activeTab === 'dataset' ? 'active' : ''}`}
            onClick={() => setActiveTab('dataset')}
          >
            <FileText size={16} /> Cleaned Dataset Preview
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="main-content">
        {loading && (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-secondary)' }}>
            <RefreshCw className="spin" size={32} style={{ marginBottom: '1rem', display: 'inline-block' }} />
            <div>Loading comprehensive econometric analysis...</div>
          </div>
        )}

        {!loading && (
          <>
            {/* TAB 1: 7 KEY INSIGHTS */}
            {activeTab === 'insights' && (
              <div>
                <div className="glass-panel">
                  <div className="panel-header">
                    <div>
                      <h2 className="panel-title"><Award size={22} color="var(--accent-cyan)" /> Executive Summary & Empirical Verdict</h2>
                      <p className="panel-desc">Investigation into whether discounts increase sales and profit across 100,000 retail transactions.</p>
                    </div>
                    <span className="badge-tag" style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#FB7185', borderColor: 'rgba(244, 63, 94, 0.3)' }}>
                      VERDICT: DISCOUNTS DO NOT INCREASE PROFIT
                    </span>
                  </div>
                  <div style={{ fontSize: '0.92rem', lineHeight: '1.6', color: '#CBD5E1' }}>
                    <strong>Management Question:</strong> <em>"Does discount really increase profit?"</em><br />
                    <strong>Empirical Conclusion:</strong> <strong>NO.</strong> The data conclusively proves that discounting does <u>not</u> produce proportional volume expansion (elasticity is effectively 0 at 3.0 units across all discount levels). Instead, discounts directly forfeit <strong>$7,910,000</strong> of gross margin, cause high-COGS categories like <strong>Electronics to turn into loss-making transactions (-$7.51/order)</strong>, and train customers to become deal-chasers who abandon full-price purchases.
                  </div>
                </div>

                <div className="insights-grid">
                  {insights.map((item) => {
                    let badgeClass = 'badge-proof';
                    if (item.impact.includes('CRITICAL') || item.impact.includes('FLAW')) badgeClass = 'badge-critical';
                    else if (item.impact.includes('RISK') || item.impact.includes('DRAIN') || item.impact.includes('DESTRUCTION')) badgeClass = 'badge-risk';
                    else if (item.impact.includes('OPPORTUNITY') || item.impact.includes('LEVERAGE')) badgeClass = 'badge-opportunity';

                    return (
                      <div key={item.id} className="insight-card">
                        <div>
                          <div className="insight-top">
                            <span className={`insight-badge ${badgeClass}`}>{item.impact}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>INSIGHT #{item.id}</span>
                          </div>
                          <h3 className="insight-title">{item.title}</h3>
                          <div className="insight-stat">{item.stat}</div>
                          <p className="insight-finding">{item.finding}</p>
                        </div>
                        <div className="insight-implication">
                          <strong style={{ color: 'var(--accent-cyan)' }}>Strategic Takeaway:</strong> {item.business_implication}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: 4 CORE VISUALIZATIONS */}
            {activeTab === 'visualizations' && (
              <div>
                <div className="glass-panel" style={{ marginBottom: '1.5rem' }}>
                  <h2 className="panel-title"><BarChart2 size={22} color="var(--accent-cyan)" /> 4 Core Visualisations Required by Challenge</h2>
                  <p className="panel-desc">High-resolution econometric plots directly answering volume elasticity, category margin degradation, full-price vs discount comparisons, and customer journey decay.</p>
                </div>

                <div className="vis-grid">
                  {/* Vis 1 */}
                  <div className="vis-card">
                    <div className="insight-top">
                      <span className="badge-tag">Visualisation 1</span>
                      <span className="badge-critical insight-badge">CRITICAL RISK</span>
                    </div>
                    <h3 className="insight-title">Contribution Margin vs Discount Tier across Product Categories</h3>
                    <p className="insight-finding">
                      Shows how margins collapse across discount tiers. Notice <strong>Electronics</strong> (yellow) dropping below the red break-even line into negative territory (-$7.51/order) at 30% discount, while Books and Clothing retain positive margins.
                    </p>
                    <div className="vis-image-container">
                      <img src={`${API_BASE}/visualizations/vis1_margin_vs_discount_by_category.png`} alt="Vis 1" className="vis-image" />
                    </div>
                  </div>

                  {/* Vis 2 */}
                  <div className="vis-card">
                    <div className="insight-top">
                      <span className="badge-tag">Visualisation 2</span>
                      <span className="badge-critical insight-badge">ZERO ELASTICITY</span>
                    </div>
                    <h3 className="insight-title">Sales Volume (Units Purchased) vs Discount Tier (Elasticity ε ≈ 0)</h3>
                    <p className="insight-finding">
                      Proves that high discounts produce <strong>NO proportional increase in quantity</strong>. Mean units purchased stays virtually unchanged at ~3.00-3.05 units whether the discount is 0%, 15%, or 30%.
                    </p>
                    <div className="vis-image-container">
                      <img src={`${API_BASE}/visualizations/vis2_volume_vs_discount_elasticity.png`} alt="Vis 2" className="vis-image" />
                    </div>
                  </div>

                  {/* Vis 3 */}
                  <div className="vis-card">
                    <div className="insight-top">
                      <span className="badge-tag">Visualisation 3</span>
                      <span className="badge-risk insight-badge">-30.2% PROFIT DILUTION</span>
                    </div>
                    <h3 className="insight-title">Discounted vs Full-Price Sales Performance Comparison</h3>
                    <p className="insight-finding">
                      Full-price orders produce an average contribution margin of <strong>$437.58</strong> (48.2% margin rate) vs only <strong>$305.27</strong> (38.8% margin rate) for discounted orders—surrendering $132.31 of profit per order.
                    </p>
                    <div className="vis-image-container">
                      <img src={`${API_BASE}/visualizations/vis3_discounted_vs_nondiscounted_comparison.png`} alt="Vis 3" className="vis-image" />
                    </div>
                  </div>

                  {/* Vis 4 */}
                  <div className="vis-card">
                    <div className="insight-top">
                      <span className="badge-tag">Visualisation 4</span>
                      <span className="badge-opportunity insight-badge">BEHAVIORAL TRAJECTORY</span>
                    </div>
                    <h3 className="insight-title">Customer Lifetime Contribution Margin Across Journey Stages</h3>
                    <p className="insight-finding">
                      Tracks customer profitability across order stages. Pure full-price buyers and pre-promotion orders deliver highest profit ($437+), whereas promotional orders compress margin to $305.
                    </p>
                    <div className="vis-image-container">
                      <img src={`${API_BASE}/visualizations/vis4_customer_journey_margin.png`} alt="Vis 4" className="vis-image" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CATEGORY PROFITABILITY */}
            {activeTab === 'categories' && financials && (
              <div className="glass-panel">
                <div className="panel-header">
                  <div>
                    <h2 className="panel-title"><PieChart size={22} color="var(--accent-cyan)" /> Category Profitability Breakdown (Useful vs Margin-Destroying)</h2>
                    <p className="panel-desc">Evaluating baseline COGS, full price profitability, steep discount margin collapse, and recommended discount rules.</p>
                  </div>
                </div>

                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Product Category</th>
                        <th>Supplier COGS Rate</th>
                        <th>Total Orders</th>
                        <th>Full-Price Margin</th>
                        <th>25%+ Discount Margin</th>
                        <th>Margin Degradation</th>
                        <th>Total Category Margin</th>
                        <th>Prescriptive Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {financials.category_profitability.map((cat) => (
                        <tr key={cat.Product_Category}>
                          <td style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{cat.Product_Category}</td>
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

                <div style={{ marginTop: '2rem', padding: '1.25rem', background: 'rgba(15, 23, 42, 0.7)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <h4 style={{ color: 'var(--accent-cyan)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Info size={16} /> Category Margin Sensitivity Insights:
                  </h4>
                  <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#CBD5E1', lineHeight: '1.6' }}>
                    <li><strong>Electronics (Margin-Destroying):</strong> With a high 70% COGS, offering discounts above 15% quickly eats into the 30% gross margin. At 30% discount, once shipping costs ($7.41) are factored in, every order loses -$7.51.</li>
                    <li><strong>Books & Clothing (Discount-Useful):</strong> Lower COGS (40-45%) gives a 55-60% gross cushion. Even at 25% discount, they generate $281 - $314 in net margin, making them ideal candidates for promotional customer acquisition.</li>
                    <li><strong>Home & Kitchen / Sports / Toys (Moderate Resilience):</strong> Healthy at 10-15% discount, but requires minimum basket thresholds ($45+) to prevent shipping overhead from consuming profits.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 4: VOLUME ELASTICITY */}
            {activeTab === 'elasticity' && financials && (
              <div className="glass-panel">
                <div className="panel-header">
                  <div>
                    <h2 className="panel-title"><ShoppingBag size={22} color="var(--accent-cyan)" /> Volume Elasticity: Do High Discounts Increase Basket Size?</h2>
                    <p className="panel-desc">Testing the core management hypothesis: whether discounts stimulate quantity increases to offset margin cuts.</p>
                  </div>
                </div>

                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Discount Tier</th>
                        <th>Order Volume</th>
                        <th>Mean Quantity (Units)</th>
                        <th>Mean Revenue</th>
                        <th>Mean Contribution Margin</th>
                        <th>Margin Rate %</th>
                        <th>Negative Margin Orders</th>
                      </tr>
                    </thead>
                    <tbody>
                      {financials.volume_elasticity.map((tier) => (
                        <tr key={tier.Discount_Tier}>
                          <td style={{ fontWeight: '700' }}>{tier.Discount_Tier}</td>
                          <td className="number-cell">{tier.Order_Count.toLocaleString()}</td>
                          <td className="number-cell" style={{ color: 'var(--accent-cyan)', fontWeight: '700' }}>
                            {tier.Mean_Quantity.toFixed(2)} units
                          </td>
                          <td className="number-cell">${tier.Mean_Revenue.toFixed(2)}</td>
                          <td className={`number-cell ${tier.Mean_Margin < 200 ? 'loss-negative' : 'profit-positive'}`}>
                            ${tier.Mean_Margin.toFixed(2)}
                          </td>
                          <td className="number-cell">{tier.Margin_Rate_Pct.toFixed(1)}%</td>
                          <td className="number-cell">
                            {tier.Negative_Margin_Orders > 0 ? (
                              <span style={{ color: '#FB7185', fontWeight: '700' }}>
                                {tier.Negative_Margin_Orders} ({tier.Negative_Margin_Pct.toFixed(1)}%)
                              </span>
                            ) : (
                              <span style={{ color: '#34D399' }}>0 (0%)</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ marginTop: '1.5rem', background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                  <h4 style={{ color: '#FB7185', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldAlert size={18} /> Econometric Proof: Perfectly Inelastic Quantity (ε ≈ 0.01)
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#F8FAFC', lineHeight: '1.5' }}>
                    If discounts were successful at driving volume, we would see average order quantity rise from 3 units at 0% to 5 or 6 units at 30% discount. In reality, order quantity remains strictly flat at <strong>3.01 ± 0.04 units</strong>. Customers purchase the exact same quantity regardless of discount, proving that discounts do not increase sales volume—they merely discount what customers would have purchased anyway.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 5: CUSTOMER BEHAVIOR */}
            {activeTab === 'customers' && customerData && (
              <div>
                <div className="glass-panel">
                  <div className="panel-header">
                    <div>
                      <h2 className="panel-title"><Users size={22} color="var(--accent-cyan)" /> Customer Journey Analysis: Before vs After Promotions</h2>
                      <p className="panel-desc">Evaluating customer transition, order value, repeat purchasing, and profitability across promotional touchpoints.</p>
                    </div>
                  </div>

                  <div className="table-wrapper">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Customer Journey Stage</th>
                          <th>Order Count</th>
                          <th>Unique Customers</th>
                          <th>Mean Order Revenue</th>
                          <th>Mean Contribution Margin</th>
                          <th>Margin Efficiency %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customerData.journey.map((j) => (
                          <tr key={j.Customer_Journey_Stage}>
                            <td style={{ fontWeight: '700' }}>{j.Customer_Journey_Stage}</td>
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

                <div className="glass-panel">
                  <div className="panel-header">
                    <div>
                      <h2 className="panel-title"><Users size={22} color="var(--accent-cyan)" /> Customer Segmentation by Discount Sensitivity</h2>
                      <p className="panel-desc">Full-Price Loyalists vs Hybrid Shoppers vs Opportunistic Discount Hunters.</p>
                    </div>
                  </div>

                  <div className="table-wrapper">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Customer Segment</th>
                          <th>Customer Base</th>
                          <th>Mean Orders / Cust</th>
                          <th>Mean Lifetime Revenue</th>
                          <th>Mean Lifetime Margin</th>
                          <th>Total Segment Margin</th>
                          <th>Margin Share %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customerData.segments.map((seg) => (
                          <tr key={seg.Segment}>
                            <td style={{ fontWeight: '700' }}>{seg.Segment}</td>
                            <td className="number-cell">{seg.Customer_Count.toLocaleString()}</td>
                            <td className="number-cell">{seg.Mean_Orders.toFixed(2)}</td>
                            <td className="number-cell">${seg.Mean_LTV_Revenue.toFixed(2)}</td>
                            <td className="number-cell profit-positive">${seg.Mean_LTV_Margin.toFixed(2)}</td>
                            <td className="number-cell">${(seg.Total_Segment_Margin / 1000000).toFixed(2)}M</td>
                            <td className="number-cell" style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>
                              {seg.Margin_Share_Pct.toFixed(1)}%
                            </td>
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
                {/* Model Performance Overview */}
                <div className="glass-panel">
                  <div className="panel-header">
                    <div>
                      <h2 className="panel-title"><Cpu size={22} color="var(--accent-cyan)" /> Machine Learning Algorithm: Linear Regression Model</h2>
                      <p className="panel-desc">Ordinary Least Squares Regression predicting Estimated Contribution Margin from transactional and categorical features.</p>
                    </div>
                    <span className="badge-tag" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                      Trained & Evaluated on 100,000 Orders (80/20 Split)
                    </span>
                  </div>

                  <div className="kpi-grid" style={{ marginBottom: '1.5rem' }}>
                    <div className="kpi-card highlight-success">
                      <span className="kpi-label">Test R² Score</span>
                      <span className="kpi-value">{(mlData.r2_test).toFixed(4)}</span>
                      <span className="kpi-subtext">Explains 83.4% of profit variance</span>
                    </div>

                    <div className="kpi-card">
                      <span className="kpi-label">Mean Absolute Error (MAE)</span>
                      <span className="kpi-value">${mlData.mae_test.toFixed(2)}</span>
                      <span className="kpi-subtext">Average prediction deviation</span>
                    </div>

                    <div className="kpi-card">
                      <span className="kpi-label">Root Mean Squared Error (RMSE)</span>
                      <span className="kpi-value">${mlData.rmse_test.toFixed(2)}</span>
                      <span className="kpi-subtext">Test set loss metric</span>
                    </div>

                    <div className="kpi-card highlight-danger">
                      <span className="kpi-label">Discount Feature Impact</span>
                      <span className="kpi-value" style={{ color: '#FB7185' }}>-$658.20</span>
                      <span className="kpi-subtext">Profit drag per 100% discount rate</span>
                    </div>
                  </div>

                  {/* Coefficients Table */}
                  <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                    Key Regression Coefficients (Marginal Profit Sensitivity):
                  </h4>
                  <div className="table-wrapper">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Feature Name</th>
                          <th>Regression Coefficient (β)</th>
                          <th>Economic Interpretation</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mlData.coefficients.slice(0, 8).map((c) => (
                          <tr key={c.feature}>
                            <td style={{ fontWeight: '600', fontFamily: 'var(--font-mono)' }}>{c.feature}</td>
                            <td className={`number-cell ${c.coefficient >= 0 ? 'profit-positive' : 'loss-negative'}`}>
                              {c.coefficient >= 0 ? `+${c.coefficient.toFixed(2)}` : c.coefficient.toFixed(2)}
                            </td>
                            <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                              {c.feature === 'Discount' && 'Every 10% discount reduces expected contribution margin by ~$65.82 directly.'}
                              {c.feature === 'Quantity' && 'Each additional unit sold adds significant gross margin to the order.'}
                              {c.feature === 'Original_Price' && 'Higher original price directly expands total gross profit dollars.'}
                              {c.feature.includes('Books') && 'Books category provides highest baseline profit lift due to lowest 40% COGS.'}
                              {c.feature.includes('Clothing') && 'Clothing provides second highest baseline profit lift.'}
                              {c.feature === 'Logistics_Cost' && 'Direct negative dollar-for-dollar deduction against margin.'}
                              {!['Discount', 'Quantity', 'Original_Price', 'Logistics_Cost'].includes(c.feature) && !c.feature.includes('Books') && !c.feature.includes('Clothing') && 'Category/Period relative adjustment to intercept.'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* LIVE WHAT-IF SIMULATOR */}
                <div className="glass-panel">
                  <div className="panel-header">
                    <div>
                      <h2 className="panel-title"><Sliders size={22} color="var(--accent-cyan)" /> Live Interactive Profit & Discount Simulator</h2>
                      <p className="panel-desc">Test any pricing, quantity, and discount scenario to predict Contribution Margin and evaluate viability before launching.</p>
                    </div>
                  </div>

                  <div className="simulator-container">
                    {/* Controls */}
                    <div className="simulator-form">
                      <div className="form-group">
                        <label className="form-label">Product Category</label>
                        <select 
                          className="form-select" 
                          value={simCategory} 
                          onChange={(e) => setSimCategory(e.target.value)}
                        >
                          <option value="Electronics">Electronics (COGS 70% - High Risk)</option>
                          <option value="Sports & Outdoors">Sports & Outdoors (COGS 52%)</option>
                          <option value="Home & Kitchen">Home & Kitchen (COGS 50%)</option>
                          <option value="Toys & Games">Toys & Games (COGS 48%)</option>
                          <option value="Clothing">Clothing (COGS 45% - High Margin)</option>
                          <option value="Books">Books (COGS 40% - High Margin)</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          <span>Original Price ($)</span>
                          <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>${simPrice}</span>
                        </label>
                        <input 
                          type="range" 
                          min="20" 
                          max="600" 
                          step="10"
                          value={simPrice} 
                          className="range-slider"
                          onChange={(e) => setSimPrice(e.target.value)} 
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          <span>Discount Rate (%)</span>
                          <span style={{ color: simDiscount > 20 ? '#FB7185' : 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
                            {simDiscount}%
                          </span>
                        </label>
                        <input 
                          type="range" 
                          min="0" 
                          max="40" 
                          step="5"
                          value={simDiscount} 
                          className="range-slider"
                          onChange={(e) => setSimDiscount(e.target.value)} 
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          <span>Order Quantity (Units)</span>
                          <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{simQuantity} units</span>
                        </label>
                        <input 
                          type="range" 
                          min="1" 
                          max="10" 
                          step="1"
                          value={simQuantity} 
                          className="range-slider"
                          onChange={(e) => setSimQuantity(e.target.value)} 
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Logistics Cost ($)</label>
                        <input 
                          type="number" 
                          className="form-input" 
                          value={simLogistics} 
                          step="0.5"
                          onChange={(e) => setSimLogistics(e.target.value)} 
                        />
                      </div>
                    </div>

                    {/* Result */}
                    {simResult && (
                      <div className="simulator-result">
                        <div>
                          <div className={`sim-status-banner ${simResult.status_color}`}>
                            {simResult.status_color === 'red' ? <ShieldAlert size={20} /> : <CheckCircle2 size={20} />}
                            {simResult.status}
                          </div>

                          <div className="sim-metrics-grid">
                            <div className="sim-metric-box">
                              <div className="label">Unit Selling Price</div>
                              <div className="val">${simResult.financial_breakdown.unit_selling_price.toFixed(2)}</div>
                            </div>

                            <div className="sim-metric-box">
                              <div className="label">Total Net Revenue</div>
                              <div className="val">${simResult.financial_breakdown.revenue.toFixed(2)}</div>
                            </div>

                            <div className="sim-metric-box">
                              <div className="label">Discount Given Away</div>
                              <div className="val" style={{ color: '#FB7185' }}>
                                -${simResult.financial_breakdown.discount_dollars_lost.toFixed(2)}
                              </div>
                            </div>

                            <div className="sim-metric-box">
                              <div className="label">Est. Contribution Margin</div>
                              <div className={`val ${simResult.financial_breakdown.exact_contribution_margin < 0 ? 'loss-negative' : 'profit-positive'}`}>
                                ${simResult.financial_breakdown.exact_contribution_margin.toFixed(2)}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                ({simResult.financial_breakdown.contribution_margin_pct.toFixed(1)}% margin)
                              </div>
                            </div>
                          </div>

                          <div className="sim-metric-box" style={{ marginBottom: '1.25rem' }}>
                            <div className="label">Linear Regression Model Prediction</div>
                            <div className="val" style={{ color: 'var(--accent-purple)' }}>
                              ${simResult.ml_model_prediction.toFixed(2)}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              Predicted from trained ML model features
                            </div>
                          </div>
                        </div>

                        <div className="sim-decision-box">
                          <strong style={{ color: simResult.status_color === 'red' ? '#FB7185' : '#34D399' }}>
                            Prescriptive Action:
                          </strong>
                          <p style={{ marginTop: '0.3rem' }}>{simResult.recommendation}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: PRACTICAL ACTION PLAN */}
            {activeTab === 'action_plan' && (
              <div>
                <div className="glass-panel" style={{ marginBottom: '1.5rem' }}>
                  <h2 className="panel-title"><CheckCircle2 size={22} color="var(--accent-cyan)" /> Practical Action Plan & Discount Strategy Matrix</h2>
                  <p className="panel-desc">A 4-pillar actionable blueprint designed for management to eliminate profit leakage and maximize contribution margin.</p>
                </div>

                {actionPlan.map((pillar, idx) => (
                  <div key={idx} className="pillar-card">
                    <div className="pillar-header">
                      <span className="badge-tag">Pillar {idx + 1}</span>
                      <h3 className="pillar-title">{pillar.pillar}</h3>
                    </div>
                    <p className="pillar-obj">{pillar.objective}</p>

                    <div className="actions-list">
                      {pillar.actions.map((act, aIdx) => (
                        <div key={aIdx} className="action-item">
                          <div className="action-category">{act.category}</div>
                          <div className="action-rule">{act.rule}</div>
                          <div className="action-benefit">
                            <span style={{ fontWeight: '600' }}>Expected Impact:</span> {act.expected_benefit}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 8: DATASET EXPLORER */}
            {activeTab === 'dataset' && datasetSample && (
              <div className="glass-panel">
                <div className="panel-header">
                  <div>
                    <h2 className="panel-title"><FileText size={22} color="var(--accent-cyan)" /> Cleaned & Standardized Dataset Preview</h2>
                    <p className="panel-desc">Showing verified records matching challenge schema (Order_ID, Product_Category, Original_Price, Discount, Selling_Price, Quantity, Logistics_Cost, Customer_ID, Promotion_Period, Revenue, Margin).</p>
                  </div>
                  <span className="badge-tag">100,000 Total Validated Rows</span>
                </div>

                <div className="table-wrapper" style={{ maxHeight: '600px', overflowY: 'auto' }}>
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
                        <th>Est. Contribution Margin</th>
                        <th>Margin %</th>
                        <th>Promotion Period</th>
                      </tr>
                    </thead>
                    <tbody>
                      {datasetSample.data.map((row) => (
                        <tr key={row.Order_ID}>
                          <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{row.Order_ID}</td>
                          <td>{row.Product_Category}</td>
                          <td className="number-cell">${row.Original_Price.toFixed(2)}</td>
                          <td className="number-cell" style={{ color: row.Discount > 0 ? '#FB7185' : 'var(--text-muted)' }}>
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
                          <td><span className="badge-tag" style={{ fontSize: '0.68rem' }}>{row.Promotion_Period}</span></td>
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

      {/* Footer */}
      <footer className="footer">
        <div>
          Data Science Hackathon • DS_Day01_15 • E-Commerce Discount & Profitability Intelligence System
        </div>
        <div style={{ marginTop: '0.4rem', color: 'var(--text-secondary)' }}>
          Powered by Python Flask Backend + React.js Frontend + Scikit-Learn Linear Regression
        </div>
      </footer>
    </div>
  );
}
