import pandas as pd
from mlxtend.frequent_patterns import apriori, association_rules

# Load basket
basket = pd.read_csv(
    "transformed_basket.csv",
    index_col=0
)

basket = basket.astype(bool)

print("Basket shape:", basket.shape)

# Apriori
frequent_items = apriori(
    basket,
    min_support=0.04,
    use_colnames=True,
    max_len=3
)

print("\n========== FREQUENT ITEMSETS ==========")
print(frequent_items.head(20))

# Association Rules
rules = association_rules(
    frequent_items,
    metric="confidence",
    min_threshold=0.3
)

# Keep useful rules
rules = rules[
    (rules["support"] >= 0.02) &
    (rules["confidence"] >= 0.3) &
    (rules["lift"] > 1)
]

# Sort by lift
rules = rules.sort_values(
    ["lift", "confidence"],
    ascending=False
)

print("\n========== TOP ASSOCIATION RULES ==========")

if rules.empty:
    print("No useful rules found.")
else:
    display_rules = rules[
        [
            "antecedents",
            "consequents",
            "support",
            "confidence",
            "lift"
        ]
    ].head(20)

    print(display_rules.to_string(index=False))

# Save
frequent_items.to_csv(
    "frequent_itemsets.csv",
    index=False
)

rules.to_csv(
    "association_rules.csv",
    index=False
)

print("\n========================================")
print("Apriori + Association Rules completed!")
print("========================================")
print("Frequent itemsets:", len(frequent_items))
print("Useful association rules:", len(rules))
