import { Box, Typography } from "@mui/material";

export default function Dashboard() {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Welcome
      </Typography>

      <Typography>Today's Purchase</Typography>
      <Typography>Today's Sales</Typography>
      <Typography>Current Stock</Typography>
      <Typography>Low Stock Items</Typography>
      <Typography>Recent Transactions</Typography>
    </Box>
  );
}