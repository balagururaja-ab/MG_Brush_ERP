from database.order_repository import OrderRepository
from database.sales_repository import SalesRepository

repo = OrderRepository()
print(repo.get_order_by_id(2))
print(repo.get_order_items(2))
