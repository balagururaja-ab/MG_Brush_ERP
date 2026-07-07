import {
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
    Box
} from "@mui/material";

import { useState } from "react";

import { useAuth } from "../../context/AuthContext";

import { useNavigate } from "react-router-dom";

import { login } from "../../api/authApi";

export default function Login() {

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [username, setUsername] = useState("");

    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const { loginUser } = useAuth();

    const handleLogin = async () => {

        setLoading(true);
        setError("");

        try {

            const response = await login(
                username,
                password
            );

            console.log("Login Response:", response);

            loginUser(response);

            navigate("/dashboard");

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.detail ||
                "Invalid username or password."
            );

        } finally {

            setLoading(false);

        }

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

                    <Box
                        component="form"
                        onSubmit={(e) => {

                            e.preventDefault();

                            handleLogin();

                        }}
                    >

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

                        {
                            error && (

                                <Typography
                                    color="error"
                                    sx={{ mt: 2 }}
                                >
                                    {error}
                                </Typography>

                            )
                        }

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3 }}
                            disabled={
                                loading ||
                                !username.trim() ||
                                !password.trim()
                            }
                        >
                            {
                                loading
                                    ? "Signing In..."
                                    : "Login"
                            }
                        </Button>

                    </Box>

                </CardContent>

            </Card>

        </Box>

    );

}