import psycopg2

conn = psycopg2.connect(
    host="localhost",
    database="postgres",
    user="postgres",
    password="mg_brush"
)

cursor = conn.cursor()
cursor.execute("SELECT version();")
print(cursor.fetchone())