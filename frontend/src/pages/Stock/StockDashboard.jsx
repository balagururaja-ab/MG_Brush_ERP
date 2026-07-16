import {

    Card,

    CardContent,

    Typography,

    Grid,

    Box,

    Paper

} from "@mui/material";

import Inventory2Icon from "@mui/icons-material/Inventory2";

import ListAltIcon from "@mui/icons-material/ListAlt";

import AddBoxIcon from "@mui/icons-material/AddBox";

import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import AssessmentIcon from "@mui/icons-material/Assessment";

import CompareArrowsIcon from "@mui/icons-material/CompareArrows";

import WarehouseIcon from "@mui/icons-material/Warehouse";

import { useNavigate } from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";

export default function StockDashboard() {

    const navigate = useNavigate();

    const cards = [

        {

            title: "Stock Summary",

            icon: <Inventory2Icon sx={{ fontSize: 50 }} />,

            path: "/stock"

        },

        {

            title: "Stock Ledger",

            icon: <ListAltIcon sx={{ fontSize: 50 }} />,

            path: "/stock/ledger"

        },

        {

            title: "Opening Stock",

            icon: <AddBoxIcon sx={{ fontSize: 50 }} />,

            path: "/stock/opening"

        },

        {

            title: "Low Stock",

            icon: <WarningAmberIcon sx={{ fontSize: 50 }} />,

            path: "/stock/low-stock"

        },

        {

            title: "Stock Valuation",

            icon: <AssessmentIcon sx={{ fontSize: 50 }} />,

            path: "#",

            disabled: true

        },

        {

            title: "Stock Adjustment",

            icon: <CompareArrowsIcon sx={{ fontSize: 50 }} />,

            path: "#",

            disabled: true

        },

        {

            title: "Warehouse Transfer",

            icon: <WarehouseIcon sx={{ fontSize: 50 }} />,

            path: "#",

            disabled: true

        }

    ];
        return (

        <MainLayout>

            <Paper

                elevation={3}

                sx={{

                    p: 4

                }}

            >

                <Typography

                    variant="h4"

                    fontWeight="bold"

                    gutterBottom

                >

                    Stock Dashboard

                </Typography>

                <Typography

                    color="text.secondary"

                    mb={4}

                >

                    Inventory Management & Stock Control

                </Typography>

                <Grid

                    container

                    spacing={3}
                    >

    {

        cards.map((card) => (

            <Grid

                key={card.title}

                size={{

                    xs: 12,

                    sm: 6,

                    md: 4,

                    lg: 3

                }}

            >

                <Card

                    onClick={() => {

                        if (!card.disabled) {

                            navigate(card.path);

                        }

                    }}

                    sx={{

                        cursor: card.disabled

                            ? "not-allowed"

                            : "pointer",

                        height: 180,

                        display: "flex",

                        flexDirection: "column",

                        justifyContent: "center",

                        alignItems: "center",

                        transition: "0.3s",

                        opacity: card.disabled

                            ? 0.55

                            : 1,

                        "&:hover": {

                            transform: card.disabled

                                ? "none"

                                : "translateY(-6px)",

                            boxShadow: card.disabled

                                ? 1

                                : 8

                        }

                    }}

                >

                    <CardContent

                        sx={{

                            textAlign: "center"

                        }}

                    >

                        <Box

                            mb={2}

                        >

                            {card.icon}

                        </Box>

                        <Typography

                            variant="h6"

                            fontWeight="bold"

                        >

                            {card.title}

                        </Typography>

                        {

                            card.disabled && (

                                <Typography

                                    variant="body2"

                                    color="text.secondary"

                                    mt={1}

                                >

                                    Coming Soon

                                </Typography>

                            )

                        }

                    </CardContent>

                </Card>

            </Grid>

        ))

    }

</Grid>

</Paper>

</MainLayout>

);

}