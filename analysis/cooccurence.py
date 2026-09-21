import pandas as pd

basket = pd.read_csv("transformed_basket.csv", index_col=0)

results = []

for product in basket.columns:

    transactions = basket[basket[product] == 1]

    if transactions.empty:
        continue

    counts = (
        transactions.drop(columns=[product])
        .sum()
        .sort_values(ascending=False)
        .head(5)
    )

    for recommended, count in counts.items():

        if count > 0:
            results.append({
                "product": product,
                "recommended": recommended,
                "transactions": int(count)
            })

result = pd.DataFrame(results)

result.to_csv(
    "cooccurrence_recommendations.csv",
    index=False
)

print("===================================")
print("CO-OCCURRENCE RECOMMENDATIONS")
print("===================================")
print("Products:", result["product"].nunique())
print("Recommendations:", len(result))
print("Saved: cooccurrence_recommendations.csv")
print("===================================")