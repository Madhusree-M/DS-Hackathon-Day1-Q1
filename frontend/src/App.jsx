import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Percent, ShoppingBag, 
  BarChart2, PieChart, Users, Cpu, ShieldAlert, CheckCircle2, 
  Sliders, FileText, RefreshCw, Award
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
  const [simResult, setSimResult] = useState(null);

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

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="brand-wrapper">
            <div className="brand-icon">
              <TrendingUp size={20} />
            </div>
            <div>
              <div className="brand-title">E-Commerce Discount & Profitability Intelligence</div>
              <div className="brand-subtitle">DS_Day01_15 • 100,000 Verified Orders</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span className="badge-tag">Linear Regression ML (R² = 0.834)</span>
            <span className="badge-tag" style={{ background: '#ECFDF5', color: '#059669', borderColor: '#A7F3D0' }}>
              Cleaned & Validated
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
              <span className="kpi-subtext">{overview.overall_margin_rate.toFixed(1)}% margin efficiency</span>
            </div>

            <div className="kpi-card highlight-danger">
              <span className="kpi-label"><Percent size={13} /> Discounts Conceded</span>
              <span className="kpi-value">${(overview.total_discount_dollars_lost / 1000000).toFixed(2)}M</span>
              <span className="kpi-subtext">{overview.discounted_orders_pct.toFixed(1)}% discounted orders</span>
            </div>

            <div className="kpi-card">
              <span className="kpi-label"><ShoppingBag size={13} /> Avg Basket Size</span>
              <span className="kpi-value">{overview.avg_quantity_per_order.toFixed(2)} units</span>
              <span className="kpi-subtext" style={{ color: '#DC2626' }}>Elasticity ε ≈ 0 (Zero lift)</span>
            </div>

            <div className="kpi-card">
              <span className="kpi-label"><ShieldAlert size={13} /> Electronics Risk</span>
              <span className="kpi-value" style={{ color: '#DC2626' }}>-$7.51</span>
              <span className="kpi-subtext">Margin at 30% discount</span>
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
            <Award size={15} /> 7 Key Insights
          </button>

          <button 
            className={`tab-btn ${activeTab === 'visualizations' ? 'active' : ''}`}
            onClick={() => setActiveTab('visualizations')}
          >
            <BarChart2 size={15} /> 4 Visualisations
          </button>

          <button 
            className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <PieChart size={15} /> Category Profitability
          </button>

          <button 
            className={`tab-btn ${activeTab === 'elasticity' ? 'active' : ''}`}
            onClick={() => setActiveTab('elasticity')}
          >
            <ShoppingBag size={15} /> Volume Elasticity
          </button>

          <button 
            className={`tab-btn ${activeTab === 'customers' ? 'active' : ''}`}
            onClick={() => setActiveTab('customers')}
          >
            <Users size={15} /> Customer Journey
          </button>

          <button 
            className={`tab-btn ${activeTab === 'ml' ? 'active' : ''}`}
            onClick={() => setActiveTab('ml')}
          >
            <Cpu size={15} /> Regression & Simulator
          </button>

          <button 
            className={`tab-btn ${activeTab === 'action_plan' ? 'active' : ''}`}
            onClick={() => setActiveTab('action_plan')}
          >
            <CheckCircle2 size={15} /> Action Plan
          </button>

          <button 
            className={`tab-btn ${activeTab === 'dataset' ? 'active' : ''}`}
            onClick={() => setActiveTab('dataset')}
          >
            <FileText size={15} /> Dataset
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
            {/* TAB 1: 7 KEY INSIGHTS (CLEAN & CONCISE) */}
            {activeTab === 'insights' && (
              <div>
                <div className="white-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    Core Verdict: <strong>Discounts do not increase profit</strong> — volume is inelastic while conceding $6.78M in gross margin.
                  </span>
                  <span className="badge-critical insight-badge">UNPROFITABLE</span>
                </div>

                <div className="insights-grid">
                  {insights.map((item) => {
                    let badgeClass = 'badge-proof';
                    if (item.impact.includes('CRITICAL') || item.impact.includes('FLAW')) badgeClass = 'badge-critical';
                    else if (item.impact.includes('RISK') || item.impact.includes('DRAIN') || item.impact.includes('DESTRUCTION')) badgeClass = 'badge-risk';
                    else if (item.impact.includes('OPPORTUNITY') || item.impact.includes('LEVERAGE')) badgeClass = 'badge-opportunity';

                    return (
                      <div key={item.id} className="insight-card">
                        <div className="insight-top">
                          <span className={`insight-badge ${badgeClass}`}>{item.impact}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>#{item.id}</span>
                        </div>
                        <h3 className="insight-title">{item.title}</h3>
                        <div className="insight-stat">{item.stat}</div>
                        <p className="insight-point">{item.business_implication}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: 4 CORE VISUALIZATIONS */}
            {activeTab === 'visualizations' && (
              <div className="vis-grid">
                <div className="vis-card">
                  <div className="insight-top">
                    <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>Visualisation 1: Margin vs Discount by Category</span>
                    <span className="badge-critical insight-badge">Electronics Loss</span>
                  </div>
                  <div className="vis-image-container">
                    <img src={`${API_BASE}/visualizations/vis1_margin_vs_discount_by_category.png`} alt="Vis 1" className="vis-image" />
                  </div>
                </div>

                <div className="vis-card">
                  <div className="insight-top">
                    <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>Visualisation 2: Quantity vs Discount Elasticity</span>
                    <span className="badge-critical insight-badge">Flat ~3.0 Units</span>
                  </div>
                  <div className="vis-image-container">
                    <img src={`${API_BASE}/visualizations/vis2_volume_vs_discount_elasticity.png`} alt="Vis 2" className="vis-image" />
                  </div>
                </div>

                <div className="vis-card">
                  <div className="insight-top">
                    <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>Visualisation 3: Full Price vs Discounted Performance</span>
                    <span className="badge-risk insight-badge">-$132 Margin Dilution</span>
                  </div>
                  <div className="vis-image-container">
                    <img src={`${API_BASE}/visualizations/vis3_discounted_vs_nondiscounted_comparison.png`} alt="Vis 3" className="vis-image" />
                  </div>
                </div>

                <div className="vis-card">
                  <div className="insight-top">
                    <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>Visualisation 4: Customer Journey Margin</span>
                    <span className="badge-proof insight-badge">Behavioral Drift</span>
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
                  <h2 className="panel-title"><PieChart size={18} /> Category Profitability Matrix</h2>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Useful vs Margin-Destroying</span>
                </div>

                <div className="table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>COGS Rate</th>
                        <th>Total Orders</th>
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
                  <h2 className="panel-title"><ShoppingBag size={18} /> Volume Elasticity by Discount Tier</h2>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Elasticity ε ≈ 0.01</span>
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
                        <th>Margin Rate</th>
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
                    <h2 className="panel-title"><Users size={18} /> Customer Journey: Before vs After Promotions</h2>
                  </div>
                  <div className="table-wrapper">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Journey Stage</th>
                          <th>Orders</th>
                          <th>Unique Customers</th>
                          <th>Mean Revenue</th>
                          <th>Mean Margin</th>
                          <th>Margin Rate</th>
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
                    <h2 className="panel-title"><Users size={18} /> Customer Loyalty Segments</h2>
                  </div>
                  <div className="table-wrapper">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Segment</th>
                          <th>Customers</th>
                          <th>Orders/Cust</th>
                          <th>Lifetime Revenue</th>
                          <th>Lifetime Margin</th>
                          <th>Total Segment Margin</th>
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
                    <h2 className="panel-title"><Cpu size={18} /> Linear Regression Model</h2>
                    <span className="badge-tag">R² = {mlData.r2_test.toFixed(4)} | MAE = ${mlData.mae_test.toFixed(2)}</span>
                  </div>

                  <div className="table-wrapper">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Feature</th>
                          <th>Coefficient (β)</th>
                          <th>Impact</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mlData.coefficients.slice(0, 7).map((c) => (
                          <tr key={c.feature}>
                            <td style={{ fontWeight: '600', fontFamily: 'var(--font-mono)' }}>{c.feature}</td>
                            <td className={`number-cell ${c.coefficient >= 0 ? 'profit-positive' : 'loss-negative'}`}>
                              {c.coefficient >= 0 ? `+${c.coefficient.toFixed(2)}` : c.coefficient.toFixed(2)}
                            </td>
                            <td style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                              {c.feature === 'Discount' && 'Direct profit drag: -$65.82 per 10% discount'}
                              {c.feature === 'Quantity' && '+$124.87 per additional unit'}
                              {c.feature === 'Original_Price' && '+$1.22 per dollar of list price'}
                              {c.feature.includes('Books') && 'Highest baseline cushion (COGS 40%)'}
                              {c.feature.includes('Clothing') && 'Strong margin resilience (COGS 45%)'}
                              {c.feature === 'Logistics_Cost' && '-$1.00 dollar-for-dollar deduction'}
                              {!['Discount', 'Quantity', 'Original_Price', 'Logistics_Cost'].includes(c.feature) && !c.feature.includes('Books') && !c.feature.includes('Clothing') && 'Relative category effect'}
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
                    <h2 className="panel-title"><Sliders size={18} /> Live Profit Simulator</h2>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>What-If Decision Engine</span>
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

            {/* TAB 8: DATASET PREVIEW */}
            {activeTab === 'dataset' && datasetSample && (
              <div className="white-panel">
                <div className="panel-header">
                  <h2 className="panel-title"><FileText size={18} /> Cleaned Dataset (50 Row Preview)</h2>
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
        DS_Day01_15 • E-Commerce Discount & Profitability Intelligence • Python Flask + React.js
      </footer>
    </div>
  );
}
