import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";

import App from "./App";
import AuthProvider from "./context/AuthContext";
import theme from "./theme/theme";

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <App />
            </AuthProvider>
        </ThemeProvider>
    </BrowserRouter>
);