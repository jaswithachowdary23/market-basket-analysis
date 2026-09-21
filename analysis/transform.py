import pandas as pd

# 1. Load cleaned dataset
df = pd.read_csv("cleaned_online_retail_5000.csv")

print("Cleaned data:", df.shape)

# 2. Keep only required columns
df = df[["InvoiceNo", "Description", "Quantity"]]

# 3. Create transaction basket
basket = df.pivot_table(
    index="InvoiceNo",
    columns="Description",
    values="Quantity",
    aggfunc="sum",
    fill_value=0
)

# 4. Convert quantities into True / False
# True  = product was purchased
# False = product was not purchased
basket = basket > 0

# 5. Save transformed basket
basket.to_csv("transformed_basket.csv")

# 6. Display results
print("\n========== TRANSFORMATION ==========")
print("Transactions:", basket.shape[0])
print("Products:", basket.shape[1])

print("\nFirst 5 transactions:")
print(basket.head())

print("\nTransformation completed!")
print("Saved as: transformed_basket.csv")