import pandas as pd

# ==============================
# LOAD DATA
# ==============================

rules = pd.read_csv("association_rules.csv")
basket = pd.read_csv("transformed_basket.csv", index_col=0)

# ==============================
# CLEAN APRIORI RULES
# ==============================

def clean_item_text(value=""):
    value = str(value)
    value = value.replace("frozenset({", "")
    value = value.replace("})", "")
    value = value.replace("{", "")
    value = value.replace("}", "")
    value = value.replace("'", "")
    return value.strip()


rules["antecedents"] = rules["antecedents"].apply(clean_item_text)
rules["consequents"] = rules["consequents"].apply(clean_item_text)


# ==============================
# FIND APRIORI RECOMMENDATIONS
# ==============================

def apriori_recommend(product):

    result = rules[
        rules["antecedents"]
        .str.contains(product, case=False, na=False)
    ]

    result = result.sort_values(
        ["confidence", "lift"],
        ascending=False
    )

    return result[
        ["antecedents", "consequents", "support", "confidence", "lift"]
    ].head(5)


# ==============================
# FALLBACK RECOMMENDATIONS
# ==============================

def cooccurrence_recommend(product):

    # Find actual product column
    matching_columns = [
        col for col in basket.columns
        if product.lower() in str(col).lower()
    ]

    if not matching_columns:
        return pd.DataFrame()

    selected_product = matching_columns[0]

    # Transactions containing selected product
    product_transactions = basket[
        basket[selected_product] == 1
    ]

    if product_transactions.empty:
        return pd.DataFrame()

    # Count other products purchased in those transactions
    product_counts = product_transactions.drop(
        columns=[selected_product]
    ).sum()

    product_counts = product_counts[
        product_counts > 0
    ].sort_values(
        ascending=False
    ).head(5)

    result = pd.DataFrame({
        "product": product_counts.index,
        "transactions": product_counts.values
    })

    return result


# ==============================
# DISPLAY
# ==============================

product = input(
    "\nEnter a product name: "
).strip()


print("\n===================================")
print("PRODUCT RECOMMENDATIONS")
print("===================================")


# First try Apriori
recommendations = apriori_recommend(product)


if not recommendations.empty:

    print("\nMethod: Apriori Association Rules")

    for _, row in recommendations.iterrows():

        print("\nIf customer buys:")
        print(row["antecedents"])

        print("Recommend:")
        print(row["consequents"])

        print("Support:",
              round(float(row["support"]), 3))

        print("Confidence:",
              round(float(row["confidence"]), 3))

        print("Lift:",
              round(float(row["lift"]), 3))


else:

    # If no Apriori rule, use co-occurrence
    recommendations = cooccurrence_recommend(product)

    if recommendations.empty:

        print("\nNo recommendations found.")
        print("Try another product name.")

    else:

        print("\nMethod: Frequently Purchased Together")

        for _, row in recommendations.iterrows():

            print("\nProduct:")
            print(row["product"])

            print(
                "Purchased together in",
                int(row["transactions"]),
                "transactions"
            )


print("\n===================================")