from database.connection import db

conn = db.connect()
cur = conn.cursor()
cur.execute('SELECT DISTINCT brand_id, brush_size_id FROM mgbrush.items ORDER BY brand_id, brush_size_id')
items = cur.fetchall()
print('items count', len(items))
for row in items:
    print(row)
print('---')
cur.execute('SELECT brand_id, brush_size_id, quantity, rate FROM mgbrush.order_details WHERE order_id=2')
ord = cur.fetchall()
print('order details count', len(ord))
for row in ord:
    print(row)
conn.close()
