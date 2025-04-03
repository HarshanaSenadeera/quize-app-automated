import pandas as pd

def transform_data():
    df = pd.read_csv("extracted_data.csv")

    # Example: Compute average score per user
    transformed_df = df.groupby("user_id")["score"].mean().reset_index()
    transformed_df.to_csv("transformed_data.csv", index=False)

    print("Data transformed successfully.....!")

if __name__ == "__main__":
    transform_data()
