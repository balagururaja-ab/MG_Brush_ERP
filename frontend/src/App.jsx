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
            </Routes>
        </>
    );
}

export default App;