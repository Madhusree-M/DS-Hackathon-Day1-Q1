import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np

plt.rcParams['figure.facecolor'] = 'white'
plt.rcParams['axes.facecolor'] = 'white'
sns.set_theme(style='whitegrid', palette='muted')

df = pd.read_csv('cleaned_ecommerce_dataset.csv')

# Chart 1: Margin vs Discount by Category
plt.figure(figsize=(9.5, 5), facecolor='white')
cat_matrix = df.groupby(['Product_Category', 'Discount'], observed=False)['Estimated_Contribution_Margin'].mean().unstack(level=0)
ax = cat_matrix.plot(kind='line', marker='o', linewidth=2.0, figsize=(9.5, 5))
plt.axhline(0, color='#DC2626', linestyle='--', linewidth=1.5, label='Break-Even ($0)')
plt.title('Contribution Margin vs Discount Rate by Category', fontsize=12, fontweight='bold', pad=12)
plt.xlabel('Discount Rate', fontsize=10)
plt.ylabel('Contribution Margin ($)', fontsize=10)
plt.legend(title='', bbox_to_anchor=(1.01, 1), loc='upper left', frameon=True)
plt.tight_layout()
plt.savefig('visualizations/vis1_margin_vs_discount_by_category.png', dpi=300, facecolor='white')
plt.close()

# Chart 2: Volume Elasticity
plt.figure(figsize=(8, 4.2), facecolor='white')
vol_summary = df.groupby('Discount')['Quantity'].mean().reset_index()
vol_summary['Discount_Label'] = (vol_summary['Discount'] * 100).astype(int).astype(str) + '%'
bars = plt.bar(vol_summary['Discount_Label'], vol_summary['Quantity'], color='#2563EB', width=0.5, edgecolor='#1D4ED8')
plt.axhline(3.0, color='#DC2626', linestyle=':', linewidth=1.8, label='Flat Benchmark (~3.0 Units)')
for bar in bars:
    yval = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2.0, yval + 0.05, f'{yval:.2f}', ha='center', va='bottom', fontweight='bold', fontsize=9)
plt.ylim(0, 3.8)
plt.title('Units Purchased vs Discount Rate (Flat Elasticity)', fontsize=12, fontweight='bold', pad=12)
plt.xlabel('Discount Tier', fontsize=10)
plt.ylabel('Mean Units / Order', fontsize=10)
plt.legend(frameon=True)
plt.tight_layout()
plt.savefig('visualizations/vis2_volume_vs_discount_elasticity.png', dpi=300, facecolor='white')
plt.close()

# Chart 3: Discounted vs Non-Discounted Comparison
plt.figure(figsize=(8, 4.2), facecolor='white')
comp = df.groupby('Is_Discounted').agg({'Revenue': 'mean', 'Estimated_Contribution_Margin': 'mean'}).reset_index()
comp['Type'] = comp['Is_Discounted'].map({True: 'Discounted', False: 'Full Price'})
x_pos = np.arange(2)
width = 0.35
revs = comp['Revenue'].tolist()
margins = comp['Estimated_Contribution_Margin'].tolist()
plt.bar(x_pos - width/2, revs, width, label='Revenue ($)', color='#3B82F6')
plt.bar(x_pos + width/2, margins, width, label='Contribution Margin ($)', color='#059669')
plt.xticks(x_pos, comp['Type'], fontweight='bold')
plt.title('Revenue & Margin: Full Price vs Discounted Orders', fontsize=12, fontweight='bold', pad=12)
plt.ylabel('USD ($)', fontsize=10)
for i in range(2):
    plt.text(i - width/2, revs[i] + 15, f"${revs[i]:.1f}", ha='center', fontweight='bold', fontsize=9)
    plt.text(i + width/2, margins[i] + 15, f"${margins[i]:.1f}", ha='center', fontweight='bold', fontsize=9)
plt.legend(frameon=True)
plt.tight_layout()
plt.savefig('visualizations/vis3_discounted_vs_nondiscounted_comparison.png', dpi=300, facecolor='white')
plt.close()

# Chart 4: Customer Journey Margin
plt.figure(figsize=(8.5, 3.8), facecolor='white')
labels = ['Full Price Loyal Orders', 'Discounted Promotional Orders']
values = [437.58, 305.27]
bars = plt.barh(labels, values, color=['#059669', '#2563EB'], height=0.45)
plt.title('Average Contribution Margin by Order Type', fontsize=12, fontweight='bold', pad=12)
plt.xlabel('Contribution Margin ($)', fontsize=10)
for bar in bars:
    w = bar.get_width()
    plt.text(w + 10, bar.get_y() + bar.get_height()/2.0, f"${w:.2f}", va='center', fontweight='bold', fontsize=9)
plt.xlim(0, 520)
plt.tight_layout()
plt.savefig('visualizations/vis4_customer_journey_margin.png', dpi=300, facecolor='white')
plt.close()

print('Charts successfully saved with clean white theme.')
