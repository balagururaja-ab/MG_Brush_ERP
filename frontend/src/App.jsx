// import AppHeader from "./components/AppHeader";
import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard/Dashboard";
import ItemList from "./pages/Item/ItemList";
import SupplierList from "./pages/Supplier/SupplierList";
import PurchaseList from "./pages/Purchase/PurchaseList";
import PurchaseEntry from "./pages/Purchase/PurchaseEntry";
import PurchaseView from "./pages/Purchase/PurchaseView";
import CustomerList from "./pages/Customer/CustomerList";
import CustomerForm from "./pages/Customer/CustomerForm";
import SalesList from "./pages/Sales/SalesList";
import SalesEntry from "./pages/Sales/SalesEntry";
import SalesView from "./pages/Sales/SalesView";
import StockDashboard from "./pages/Stock/StockDashboard";
import StockSummary from "./pages/Stock/StockSummary";
import StockLedger from "./pages/Stock/StockLedger";
import ItemLedger from "./pages/Stock/ItemLedger";
import OpeningStock from "./pages/Stock/OpeningStock";
import LowStock from "./pages/Stock/LowStock";
import OrderList from "./pages/Order/OrderList";
import OrderEntry from "./pages/Order/OrderEntry";
import OrderView from "./pages/Order/OrderView";
import ProductionList from "./pages/Product/ProductionList";
import ProductionEntry from "./pages/Product/ProductionEntry";
import ProductionView from "./pages/Product/ProductionView";

function App() {
    return (
        <>
            {/* <AppHeader /> */}

            <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/items" element={<ItemList />} />
                <Route path="/suppliers" element={<SupplierList />} />
                <Route path="/purchases" element={<PurchaseList />} />
                <Route path="/purchase/new" element={<PurchaseEntry />} />
                <Route path="/purchase/:id" element={<PurchaseView />} />
                <Route path="/purchase/edit/:id" element={<PurchaseEntry />} />
                <Route
                    path="/customers"
                    element={<CustomerList />}
                />

                <Route
                    path="/customer/new"
                    element={<CustomerForm />}
                />

                <Route
                    path="/customer/edit/:id"
                    element={<CustomerForm />}
                />
                <Route path="/sales" element={<SalesList />} />
                <Route path="/sales/new" element={<SalesEntry />} />
                <Route path="/sales/:id" element={<SalesView />} />
                <Route path="/sales/edit/:id" element={<SalesEntry />} />
                <Route
                    path="/stock/dashboard"
                    element={<StockDashboard />}
                />

                <Route
                    path="/stock"
                    element={<StockSummary />}
                />

                <Route
                    path="/stock/ledger"
                    element={<StockLedger />}
                />

                <Route
                    path="/stock/item/:itemId"
                    element={<ItemLedger />}
                />

                <Route
                    path="/stock/opening"
                    element={<OpeningStock />}
                />

                <Route
                    path="/stock/low-stock"
                    element={<LowStock />}
                />

                <Route
                    path="/orders"
                    element={<OrderList />}
                />

                <Route
                    path="/orders/new"
                    element={<OrderEntry />}
                />

                <Route
                    path="/orders/:id"
                    element={<OrderView />}
                />

                <Route
                    path="/orders/edit/:id"
                    element={<OrderEntry />}
                />
                <Route
                    path="/productions"
                    element={<ProductionList />}
                />

                <Route
                    path="/productions/new"
                    element={<ProductionEntry />}
                />

                <Route
                    path="/productions/edit/:id"
                    element={<ProductionEntry />}
                />

                <Route
                    path="/productions/view/:id"
                    element={<ProductionView />}
                />
            </Routes>
        </>
    );
}

export default App;