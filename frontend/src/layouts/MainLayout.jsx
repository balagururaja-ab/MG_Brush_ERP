import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import AppHeader from "../components/AppHeader";
import AppDrawer from "../components/AppDrawer";
import AppFooter from "../components/AppFooter";

export default function MainLayout() {
    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            {/* <AppDrawer /> */}

            <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                <AppHeader />

                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        bgcolor: "#f5f5f5"
                    }}
                >
                    <Outlet />
                </Box>

                <AppFooter />
            </Box>
        </Box>
    );
}