import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import PurchaseEntry from "../pages/Purchase/PurchaseEntry";
import SupplierList from "../pages/Supplier/SupplierList";
import ItemList from "../pages/Item/ItemList";
import StockSummary from "../pages/Stock/StockSummary";
import SalesEntry from "../pages/Sales/SalesEntry";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../routes/ProtectedRoute";

export default function AppRoutes() {

    return (

        <Routes>

            <Route
                path="/"
                element={<Login />}
            />

            <Route
                element={
                    <ProtectedRoute>
                        <MainLayout />
                    </ProtectedRoute>
                }
            >

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/purchase"
                    element={<PurchaseEntry />}
                />

                <Route
                    path="/suppliers"
                    element={<SupplierList />}
                />

                <Route
                    path="/items"
                    element={<ItemList />}
                />

                <Route
                    path="/stock"
                    element={<StockSummary />}
                />

                <Route
                    path="/sales"
                    element={<SalesEntry />}
                />

            </Route>

        </Routes>

    );

}