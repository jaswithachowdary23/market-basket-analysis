# 🛒 Market Basket Analysis
A web-based **Market Basket Analysis** project that discovers relationships between products purchased together using **Data Mining and Association Rule Mining** techniques.
The project uses **Apriori Algorithm** to identify frequent itemsets and generate association rules based on Support, Confidence, and Lift.
## 🚀 Live Demo
https://market-basket-analysis-jaswitha2.vercel.app/
## 📌 About the Project
Market Basket Analysis is a data mining technique used to understand customer purchasing behavior by finding products that are frequently purchased together.
This project takes transactional sales data, processes and transforms it into a suitable format, and applies the **Apriori algorithm** to discover meaningful product associations.
## ✨ Features
- 📂 Transactional dataset processing
- 🧹 Data cleaning and preprocessing
- 🔄 Data transformation
- 📊 Transaction analysis
- 🔎 Frequent itemset generation
- 🤝 Association rule mining
- 📈 Support calculation
- 🎯 Confidence calculation
- 💡 Lift calculation
- 📋 Interactive results display
- 📊 Data visualization
- 🌐 User-friendly web interface
## 🧠 Technologies Used
### Frontend
- React
- Vite
- HTML
- CSS
- JavaScript
### Data Mining
- Python
- Pandas
- NumPy
- Mlxtend
- Apriori Algorithm
### Deployment
- Vercel
## 🔄 Project Workflow
```text
Raw Transaction Data
        ↓
Data Cleaning
        ↓
Data Transformation
        ↓
Transaction Encoding
        ↓
Apriori Algorithm
        ↓
Frequent Itemsets
        ↓
Association Rules
        ↓
Support / Confidence / Lift
        ↓
Results & Visualizations
PROJECT STRUCTURE:
market-basket-analysis/
│
├── public/
│
├── src/
│   ├── components/
│   ├── assets/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── data/
│   └── dataset.csv
│
├── notebooks/
│   └── market_basket_analysis.ipynb
│
├── package.json
├── vite.config.js
└── README.md
