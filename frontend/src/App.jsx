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
            </Routes>
        </>
    );
}

export default App;