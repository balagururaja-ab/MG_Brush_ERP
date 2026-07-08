import {

    Box,
    Typography

} from "@mui/material";

export default function Footer() {

    return (

        <Box

            sx={{

                bgcolor: "primary.main",

                color: "white",

                p: 2,

                textAlign: "center"

            }}

        >

            <Typography>

                © 2026 MG Brush Company

            </Typography>

            <Typography variant="body2">

                தரம் தான் எங்கள் அடையாளம் · நம்பிக்கை தான் எங்கள் பலம்

            </Typography>

        </Box>

    );

}