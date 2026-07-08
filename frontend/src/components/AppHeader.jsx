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

                <Box>

                    <Typography
                        variant="h7"
                        fontWeight="bold"
                    >
                        MG Brush ERP
                    </Typography>
                    

                </Box>

            </Toolbar>

        </AppBar>

    );

}