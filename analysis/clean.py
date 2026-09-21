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
    min_support=0.02,
    use_colnames=True,
    max_len=3
)

print("\n========== FREQUENT ITEMSETS ==========")
print(frequent_items.head(20))

# Association Rules
if len(frequent_items) > 1:

    rules = association_rules(
        frequent_items,
        metric="confidence",
        min_threshold=0.3
    )

    rules = rules.sort_values(
        "lift",
        ascending=False
    )

else:
    rules = pd.DataFrame()

print("\n========== ASSOCIATION RULES ==========")

if rules.empty:
    print("No association rules found.")
else:
    print(
        rules[
            [
                "antecedents",
                "consequents",
                "support",
                "confidence",
                "lift"
            ]
        ].head(20)
    )

# Save results
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
print("Association rules:", len(rules))