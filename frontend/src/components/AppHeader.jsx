import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Button
} from "@mui/material";

import { Link } from "react-router-dom";

import logo from "../assets/IMG-20260829-WA0004.jpg";

const navItems = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Items", to: "/items" },
    { label: "Suppliers", to: "/suppliers" },
    { label: "Purchase", to: "/purchases" },
    { label: "Customers", to: "/customers" },
    { label: "Orders", to: "/orders" },
    { label: "Sales", to: "/sales" },
    { label: "Stock", to: "/stock/dashboard" },
    { label: "Production", to: "/productions" },
    { label: "Reports", to: "/reports" }
];

export default function AppHeader() {

    return (

        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                background: "linear-gradient(90deg, #0a4a3a 0%, #0d5d43 38%, #0a4538 100%)",
                borderBottom: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 10px 24px rgba(10, 47, 38, 0.18)",
                backdropFilter: "saturate(1.1) blur(4px)"
            }}
        >

            <Toolbar
                sx={{
                    minHeight: { xs: 70, md: 88 },
                    px: { xs: 2, md: 3 },
                    gap: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        minWidth: 0,
                        flexShrink: 0
                    }}
                >
                    <Box
                        sx={{
                            width: 78,
                            height: 78,
                            borderRadius: 2.5,
                            background: "#ffffff",
                            border: "1px solid rgba(255,255,255,0.25)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            p: 0.8,
                            boxShadow: "0 8px 18px rgba(5, 30, 22, 0.18)"
                        }}
                    >
                        <Box
                            component="img"
                            src={logo}
                            alt="MG Brush ERP logo"
                            sx={{
                                height: "100%",
                                width: "100%",
                                objectFit: "contain",
                                display: "block",
                                borderRadius: 1.5
                            }}
                        />
                    </Box>

                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 800,
                            letterSpacing: "0.03em",
                            whiteSpace: "nowrap",
                            color: "#f5fbf8",
                            textTransform: "uppercase",
                            fontSize: { xs: "1.05rem", md: "1.45rem" }
                        }}
                    >
                        MG Brush ERP
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        flexWrap: "wrap",
                        gap: 0.7,
                        flexGrow: 1,
                        ml: 2
                    }}
                >
                    {navItems.map((item) => (
                        <Button
                            key={item.label}
                            color="inherit"
                            component={Link}
                            to={item.to}
                            sx={{
                                color: "rgba(255,255,255,0.9)",
                                px: 1.5,
                                py: 0.9,
                                borderRadius: 1.5,
                                fontWeight: 700,
                                fontSize: "0.93rem",
                                letterSpacing: "0.01em",
                                minWidth: "auto",
                                transition: "all 0.2s ease",
                                position: "relative",
                                textTransform: "none",
                                "&:hover": {
                                    background: "rgba(255,255,255,0.08)",
                                    color: "#ffffff",
                                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)"
                                },
                                "&:before": {
                                    content: '""',
                                    position: "absolute",
                                    left: 10,
                                    right: 10,
                                    bottom: 5,
                                    height: 2,
                                    borderRadius: 999,
                                    background: "transparent",
                                    transition: "all 0.2s ease"
                                },
                                "&:hover:before": {
                                    background: "rgba(255,255,255,0.8)"
                                }
                            }}
                        >
                            {item.label}
                        </Button>
                    ))}
                </Box>
            </Toolbar>

        </AppBar>

    );

}