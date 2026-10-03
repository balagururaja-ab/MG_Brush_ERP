import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Stack
} from "@mui/material";

import {
    Inventory2Rounded,
    BusinessRounded,
    PeopleAltRounded,
    ShoppingCartRounded,
    ReceiptLongRounded,
    TrendingUpRounded,
    WarehouseRounded,
    PrecisionManufacturingRounded,
    AssessmentRounded
} from "@mui/icons-material";

import {
    useNavigate
} from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";

const moduleIcons = {
    Items: Inventory2Rounded,
    Suppliers: BusinessRounded,
    Customers: PeopleAltRounded,
    Purchase: ShoppingCartRounded,
    Orders: ReceiptLongRounded,
    Sales: TrendingUpRounded,
    Stock: WarehouseRounded,
    Production: PrecisionManufacturingRounded,
    Reports: AssessmentRounded
};

export default function Dashboard() {

    const navigate = useNavigate();

    const cards = [
        { title: "Items", route: "/items" },
        { title: "Suppliers", route: "/suppliers" },
        { title: "Customers", route: "/customers" },
        { title: "Purchase", route: "/purchases" },
        { title: "Orders", route: "/orders" },
        { title: "Sales", route: "/sales" },
        { title: "Stock", route: "/stock" },
        { title: "Production", route: "/productions" },
        { title: "Reports", route: "/reports" }
    ];

    const summaryCards = [
        { label: "Sales today", value: "₹ 2,48,600", tone: "#0e5a41" },
        { label: "Orders pending", value: "18", tone: "#e67e22" },
        { label: "Low stock", value: "12 items", tone: "#b42318" },
        { label: "Production run", value: "07 batches", tone: "#2563eb" }
    ];

    return (

        <MainLayout>

            <Box sx={{ maxWidth: 1400, mx: "auto" }}>
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", md: "center" }}
                    spacing={2}
                    mb={4}
                >
                    <Box>
                        <Typography
                            variant="overline"
                            sx={{
                                display: "block",
                                color: "#4e6b62",
                                letterSpacing: "0.12em",
                                mb: 0.8,
                                fontWeight: 700
                            }}
                        >
                            Operations overview
                        </Typography>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 800,
                                color: "#123129",
                                letterSpacing: "-0.03em"
                            }}
                        >
                            Welcome to MG Brush ERP
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            px: 2,
                            py: 1,
                            borderRadius: 999,
                            background: "rgba(14, 90, 65, 0.08)",
                            color: "#0e5a41",
                            fontWeight: 700,
                            border: "1px solid rgba(14, 90, 65, 0.18)"
                        }}
                    >
                        Updated today
                    </Box>
                </Stack>

                <Grid container spacing={2.5} mb={4}>
                    {summaryCards.map((item) => (
                        <Grid item xs={12} sm={6} md={3} key={item.label}>
                            <Card
                                sx={{
                                    height: "100%",
                                    background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(241,246,244,0.94))",
                                    border: "1px solid rgba(15, 44, 34, 0.08)",
                                    borderLeft: `4px solid ${item.tone}`,
                                    boxShadow: "0 8px 22px rgba(15, 44, 34, 0.06)"
                                }}
                            >
                                <CardContent>
                                    <Typography variant="caption" sx={{ color: "#5b6f67", fontWeight: 600, textTransform: "uppercase" }}>
                                        {item.label}
                                    </Typography>
                                    <Typography variant="h5" sx={{ mt: 1, fontWeight: 800, color: "#15382f" }}>
                                        {item.value}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Grid container spacing={3}>
                    {cards.map((card) => {
                        const Icon = moduleIcons[card.title];

                        return (
                            <Grid item xs={12} sm={6} md={4} key={card.title}>
                                <Card
                                    onClick={() => navigate(card.route)}
                                    sx={{
                                        height: "100%",
                                        cursor: "pointer",
                                        background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(244,247,246,0.9))",
                                        border: "1px solid rgba(17, 52, 42, 0.08)",
                                        boxShadow: "0 8px 26px rgba(14, 42, 34, 0.08)",
                                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                        "&:hover": {
                                            transform: "translateY(-2px)",
                                            boxShadow: "0 12px 30px rgba(14, 42, 34, 0.12)"
                                        }
                                    }}
                                >
                                    <CardContent sx={{ p: 3 }}>
                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                                            <Box
                                                sx={{
                                                    width: 48,
                                                    height: 48,
                                                    borderRadius: 2,
                                                    background: "linear-gradient(135deg, #0e5a41, #1b7d5d)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    color: "#fff"
                                                }}
                                            >
                                                <Icon fontSize="medium" />
                                            </Box>
                                            <Typography sx={{ color: "#719085", fontWeight: 700 }}>
                                                Open
                                            </Typography>
                                        </Box>

                                        <Typography variant="h6" sx={{ fontWeight: 800, color: "#123129" }}>
                                            {card.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: "#587166", mt: 0.8 }}>
                                            Manage {card.title.toLowerCase()} operations and workflows.
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>

        </MainLayout>

    );

}