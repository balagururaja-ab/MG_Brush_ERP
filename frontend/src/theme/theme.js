import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1565C0",
    },
    secondary: {
      main: "#00897B",
    },
  },
  shape: {
    borderRadius: 10,
  },
});

export default theme;