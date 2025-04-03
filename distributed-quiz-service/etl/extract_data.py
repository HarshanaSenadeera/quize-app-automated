import pandas as pd
import sqlalchemy
from sqlalchemy import create_engine

# Database connection details
DB_URI = "mysql+pymysql://root:1234@quiz-database:3306/quiz_db"

# Create engine once, reuse it in the function
engine = create_engine(DB_URI)

# Extract data
def extract_data():
    try:
        # Query to fetch all data from quiz_results
        query = "SELECT * FROM quiz_results"

        # Read data into pandas DataFrame
        df = pd.read_sql(query, engine)

        # Save DataFrame to CSV
        df.to_csv("extracted_data.csv", index=False)

        print("Data extracted successfully....!")

    except Exception as e:
        print(f"Error extracting data: {e}")
    finally:
        # Dispose of the engine connection after use
        engine.dispose()

if __name__ == "__main__":
    extract_data()
