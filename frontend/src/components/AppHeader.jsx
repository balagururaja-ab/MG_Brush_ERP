import {

    AppBar,
    Toolbar,
    Typography,
    Box

} from "@mui/material";

import logo from "../assets/logo.png";

export default function Header() {

    return (

        <AppBar position="static">

            <Toolbar>

                <Box
                    component="img"
                    src={logo}
                    sx={{
                        height: 150,
                        mr: 6
                    }}
                />

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ flexGrow: 1 }}
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

            </Toolbar>

        </AppBar>

    );

}