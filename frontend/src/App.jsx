// import AppHeader from "./components/AppHeader";
import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard/Dashboard";
import ItemList from "./pages/Item/ItemList";
import SupplierList from "./pages/Supplier/SupplierList";

function App() {
    return (
        <>
            {/* <AppHeader /> */}

            <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/items" element={<ItemList />} />
                <Route path="/suppliers" element={<SupplierList />} />
            </Routes>
        </>
    );
}

export default App;