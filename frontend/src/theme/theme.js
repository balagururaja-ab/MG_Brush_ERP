import { createTheme } from "@mui/material/styles";

const theme = createTheme({

    palette: {

        primary: {
            main: "#0B5D2A"
        },

        secondary: {
            main: "#C62828"
        },

        background: {
            default: "#F4F7F6"
        }

    },

    typography: {

        fontFamily: "Roboto, sans-serif",

        h4: {
            fontWeight: 700
        },

        h5: {
            fontWeight: 600
        },

        button: {
            textTransform: "none",
            fontWeight: 600
        }

    },

    shape: {

        borderRadius: 10

    }

});

export default theme;