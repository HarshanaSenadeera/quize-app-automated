import pandas as pd
import sqlalchemy

# Database connection details
DB_URI = "mysql+pymysql://root:1234@localhost:3307/quiz_db"


# Extract data
def extract_data():
    engine = sqlalchemy.create_engine(DB_URI)
    query = "SELECT * FROM quiz_results"
    df = pd.read_sql(query, engine)
    df.to_csv("extracted_data.csv", index=False)
    print("Data extracted successfully............!")

if __name__ == "__main__":
    extract_data()
