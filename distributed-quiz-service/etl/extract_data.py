import pandas as pd
import sqlalchemy
from sqlalchemy import create_engine

# Database connection details
DB_URI = "mysql+pymysql://root:1234@quiz-database:3306/quiz_db"

engine = create_engine(DB_URI)

# Extract data
def extract_data():
    engine = sqlalchemy.create_engine(DB_URI)
    query = "SELECT * FROM quiz_results"
    df = pd.read_sql(query, engine)
    df.to_csv("extracted_data.csv", index=False)
    print("Data extracted successfully!")

if __name__ == "__main__":
    extract_data()
