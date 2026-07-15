import { Box } from "@mui/material";

import AppHeader from "../components/AppHeader";
// import AppDrawer from "../components/AppDrawer";
import AppFooter from "../components/AppFooter";

export default function MainLayout({ children }) {

    return (

        <Box
            sx={{
                display: "flex",
                minHeight: "100vh"
            }}
        >

            {/* <AppDrawer /> */}

            <Box
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column"
                }}
            >

                <AppHeader />

                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        bgcolor: "#f5f5f5"
                    }}
                >

                    {children}

                </Box>

                <AppFooter />

            </Box>

        </Box>

    );

}