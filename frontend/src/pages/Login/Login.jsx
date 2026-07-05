import {
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
    Box
} from "@mui/material";

import { useState } from "react";

export default function Login() {

    const [username, setUsername] = useState("");

    const [password, setPassword] = useState("");

    const handleLogin = () => {

        console.log(username, password);

    };

    return (

        <Box

            display="flex"

            justifyContent="center"

            alignItems="center"

            height="100vh"

        >

            <Card sx={{ width: 420 }}>

                <CardContent>

                    <Typography
                        variant="h4"
                        align="center"
                        gutterBottom
                    >
                        MG Brush ERP
                    </Typography>

                    <Typography
                        align="center"
                        color="text.secondary"
                        sx={{ mb: 3 }}
                    >
                        Login
                    </Typography>

                    <TextField

                        fullWidth

                        label="Username"

                        margin="normal"

                        value={username}

                        onChange={(e) =>
                            setUsername(e.target.value)
                        }

                    />

                    <TextField

                        fullWidth

                        type="password"

                        label="Password"

                        margin="normal"

                        value={password}

                        onChange={(e) =>
                            setPassword(e.target.value)
                        }

                    />

                    <Button

                        fullWidth

                        variant="contained"

                        sx={{ mt: 3 }}

                        onClick={handleLogin}

                    >

                        Login

                    </Button>

                </CardContent>

            </Card>

        </Box>

    );

}