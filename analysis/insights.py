import pandas as pd
# Load results
frequent_items = pd.read_csv("frequent_itemsets.csv")
rules = pd.read_csv("association_rules.csv")
print("\n========================================")
print("        MARKET BASKET INSIGHTS")
print("========================================")
# ---------- BASIC STATISTICS ----------
print("\n--- Dataset Summary ---")
print("Frequent Itemsets:", len(frequent_items))
print("Association Rules:", len(rules))

print(
    "Average Support:",
    round(frequent_items["support"].mean(), 3)
)

print(
    "Average Confidence:",
    round(rules["confidence"].mean(), 3)
)

print(
    "Average Lift:",
    round(rules["lift"].mean(), 3)
)


# ---------- TOP PRODUCT ----------

top_product = frequent_items.sort_values(
    "support",
    ascending=False
).iloc[0]

print("\n--- Most Frequent Product ---")

print("Product:", top_product["itemsets"])
print(
    "Support:",
    round(top_product["support"], 3)
)


# ---------- BEST RULE BY LIFT ----------

best_rule = rules.sort_values(
    "lift",
    ascending=False
).iloc[0]

print("\n--- Strongest Association ---")

print("If customer buys:", best_rule["antecedents"])
print("Recommend:", best_rule["consequents"])
print(
    "Confidence:",
    round(best_rule["confidence"], 3)
)
print(
    "Lift:",
    round(best_rule["lift"], 3)
)


# ---------- BEST RULE BY CONFIDENCE ----------

confidence_rule = rules.sort_values(
    "confidence",
    ascending=False
).iloc[0]

print("\n--- Highest Confidence Rule ---")

print("If customer buys:", confidence_rule["antecedents"])
print("Recommend:", confidence_rule["consequents"])
print(
    "Confidence:",
    round(confidence_rule["confidence"], 3)
)


# ---------- BUSINESS INSIGHTS ----------

print("\n--- Business Insights ---")

print("1. Frequently purchased products can be identified.")

print("2. Products with strong associations can be recommended together.")

print("3. High-confidence rules can support cross-selling.")

print("4. Lift greater than 1 indicates a positive association.")

print("5. Association rules can help improve product recommendations.")


print("\n========================================")
print("       INSIGHTS GENERATION COMPLETE")
print("========================================")