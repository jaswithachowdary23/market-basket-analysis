import pandas as pd
import matplotlib.pyplot as plt

# Load results
frequent_items = pd.read_csv("frequent_itemsets.csv")
rules = pd.read_csv("association_rules.csv")


# ---------- 1. TOP PRODUCTS BY SUPPORT ----------

frequent_items["item"] = frequent_items["itemsets"].str.replace(
    "frozenset({", "", regex=False
).str.replace(
    "})", "", regex=False
)

top_products = frequent_items.sort_values(
    "support", ascending=False
).head(10)

plt.figure(figsize=(10, 6))

plt.barh(
    top_products["item"],
    top_products["support"]
)

plt.xlabel("Support")
plt.ylabel("Product")
plt.title("Top 10 Products by Support")
plt.gca().invert_yaxis()

plt.tight_layout()
plt.savefig("top_products_support.png")
plt.show()


# ---------- 2. TOP RULES BY CONFIDENCE ----------

rules["rule"] = (
    rules["antecedents"]
    .str.replace("frozenset({", "", regex=False)
    .str.replace("})", "", regex=False)
    + " → "
    + rules["consequents"]
    .str.replace("frozenset({", "", regex=False)
    .str.replace("})", "", regex=False)
)

top_confidence = rules.sort_values(
    "confidence", ascending=False
).head(10)

plt.figure(figsize=(10, 6))

plt.barh(
    top_confidence["rule"],
    top_confidence["confidence"]
)

plt.xlabel("Confidence")
plt.ylabel("Association Rule")
plt.title("Top 10 Association Rules by Confidence")
plt.gca().invert_yaxis()

plt.tight_layout()
plt.savefig("top_rules_confidence.png")
plt.show()


# ---------- 3. TOP RULES BY LIFT ----------

top_lift = rules.sort_values(
    "lift", ascending=False
).head(10)

plt.figure(figsize=(10, 6))

plt.barh(
    top_lift["rule"],
    top_lift["lift"]
)

plt.xlabel("Lift")
plt.ylabel("Association Rule")
plt.title("Top 10 Association Rules by Lift")
plt.gca().invert_yaxis()

plt.tight_layout()
plt.savefig("top_rules_lift.png")
plt.show()


# ---------- 4. SUPPORT VS CONFIDENCE ----------

plt.figure(figsize=(8, 6))

plt.scatter(
    rules["support"],
    rules["confidence"]
)

plt.xlabel("Support")
plt.ylabel("Confidence")
plt.title("Support vs Confidence")

plt.tight_layout()
plt.savefig("support_vs_confidence.png")
plt.show()


print("\n====================================")
print("VISUALIZATION COMPLETED")
print("====================================")

print("\nGenerated files:")
print("1. top_products_support.png")
print("2. top_rules_confidence.png")
print("3. top_rules_lift.png")
print("4. support_vs_confidence.png")