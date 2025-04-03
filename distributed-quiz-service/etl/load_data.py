import pandas as pd
import sqlalchemy

# Destination database (Data Warehouse)
DW_URI = "postgresql://user:password@data-warehouse:5432/quiz_dw"

def load_data():
    engine = sqlalchemy.create_engine(DW_URI)
    df = pd.read_csv("extracted_data.csv")
    df.to_sql("quiz_results_dw", engine, if_exists="replace", index=False)
    print("Data loaded successfully...!")

if __name__ == "__main__":
    load_data()
