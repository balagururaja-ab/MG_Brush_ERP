import { Box } from "@mui/material";

import AppHeader from "../components/AppHeader";
// import AppDrawer from "../components/AppDrawer";
import AppFooter from "../components/AppFooter";

export default function MainLayout({ children }) {

    return (

        <Box
            sx={{
                display: "flex",
                minHeight: "100vh",
                background: "radial-gradient(circle at top, rgba(14, 93, 67, 0.08), transparent 40%)",
                color: "#17312a"
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
                        p: { xs: 2, md: 4 },
                        background: "linear-gradient(180deg, rgba(243,247,245,0.9) 0%, rgba(230,238,235,0.95) 100%)"
                    }}
                >

                    {children}

                </Box>

                <AppFooter />

            </Box>

        </Box>

    );

}