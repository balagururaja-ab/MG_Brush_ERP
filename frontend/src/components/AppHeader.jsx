import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Button
} from "@mui/material";

import { Link } from "react-router-dom";

import logo from "../assets/logo.png";

export default function AppHeader() {

    return (

        <AppBar position="static">

            <Toolbar>

                <Box
                    component="img"
                    src={logo}
                    sx={{
                        height: 70,
                        mr: 3
                    }}
                />

                <Typography
                    variant="h6"
                    sx={{
                        flexGrow: 1,
                        fontWeight: "bold"
                    }}
                >
                    MG Brush ERP
                </Typography>

                <Button
                    color="inherit"
                    component={Link}
                    to="/dashboard"
                >
                    Dashboard
                </Button>

                <Button
                    color="inherit"
                    component={Link}
                    to="/items"
                >
                    Items
                </Button>

                <Button
                    color="inherit"
                    component={Link}
                    to="/suppliers"
                >
                    Suppliers
                </Button>

                <Button
                    color="inherit"
                    component={Link}
                    to="/purchases"
                >
                    Purchase
                </Button>

                <Button
                    color="inherit"
                    component={Link}
                    to="/customers"
                >
                    Customers
                </Button>

                <Button
                    color="inherit"
                    component={Link}
                    to="/sales"
                >
                    Sales
                </Button>

                <Button
                    color="inherit"
                    component={Link}
                    to="/stock/dashboard"
                >
                    Stock
                </Button>

            </Toolbar>

        </AppBar>

    );

}