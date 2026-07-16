import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid
} from "@mui/material";

import {
    useNavigate
} from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";

export default function Dashboard() {

    const navigate = useNavigate();

    const cards = [

        {
            title: "Items",
            route: "/items"
        },

        {
            title: "Suppliers",
            route: "/suppliers"
        },

        {
            title: "Customers",
            route: "/customers"
        },

        {
            title: "Purchase",
            route: "/purchase"
        },

        {
            title: "Sales",
            route: "/sales"
        },

        {
            title: "Stock",
            route: "/stock"
        }

    ];

    return (

        <MainLayout>

            <Typography
                variant="h4"
                fontWeight="bold"
                mb={4}
            >
                Welcome to MG Brush ERP
            </Typography>

            <Grid
                container
                spacing={3}
            >

                {cards.map((card) => (

                    <Grid
                        size={{ xs: 12, sm: 6, md: 4 }}
                        key={card.title}
                    >

                        <Card

                            sx={{
                                cursor: "pointer",
                                transition: "0.3s",
                                "&:hover": {
                                    boxShadow: 6
                                }
                            }}

                            onClick={() =>
                                navigate(card.route)
                            }

                        >

                            <CardContent>

                                <Typography
                                    variant="h6"
                                    fontWeight="bold"
                                >
                                    {card.title}
                                </Typography>

                            </CardContent>

                        </Card>

                    </Grid>

                ))}

            </Grid>

        </MainLayout>

    );

}