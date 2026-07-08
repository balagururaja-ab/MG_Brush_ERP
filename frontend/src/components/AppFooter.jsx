import { Box, Typography } from "@mui/material";

export default function AppFooter() {
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: "#0b5d3b",
                color: "#fff",
                textAlign: "center",
                py: 1.5,
                mt: "auto",
                borderTop: "3px solid #d32f2f"
            }}
        >
            <Typography variant="body2" fontWeight={500}>
                M.G. Brush Company © {new Date().getFullYear()}
            </Typography>

            <Typography variant="caption">
                தரம் தான் எங்கள் அடையாளம்... நம்பிக்கை தான் எங்கள் பலம்...
            </Typography>
        </Box>
    );
}