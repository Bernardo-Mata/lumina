import sqlite3

db_path = "c:/bernardo/Infosys/Lumina/API/lumina.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

columns = [
    ("dashboard_json", "TEXT"),
    ("alerts_json", "TEXT"),
    ("suppliers_json", "TEXT"),
    ("compliance_json", "TEXT"),
    ("risk_scores_json", "TEXT"),
    ("disruption_json", "TEXT"),
    ("created_at", "DATETIME")
]

for col, coltype in columns:
    try:
        cursor.execute(f"ALTER TABLE insights ADD COLUMN {col} {coltype};")
        print(f"Added column {col}")
    except Exception as e:
        print(f"Could not add column {col}: {e}")

conn.commit()
conn.close()
print("Migration finished.")