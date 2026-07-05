import {
  Avatar,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography
} from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export default function LoginPage() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center"
        }}
      >
        <Paper
          elevation={8}
          sx={{
            width: "100%",
            p: 5,
            borderRadius: 3
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Avatar
              sx={{
                bgcolor: "primary.main",
                mb: 2
              }}
            >
              <LockOutlinedIcon />
            </Avatar>

            <Typography variant="h4" fontWeight="bold">
              MG Brush ERP
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mb: 4 }}
            >
              Sign in to continue
            </Typography>

            <TextField
              label="Username"
              fullWidth
              margin="normal"
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
            />

            <Button
              variant="contained"
              fullWidth
              size="large"
              sx={{
                mt: 3,
                py: 1.5
              }}
            >
              Login
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}