import { Typography, Paper } from "@mui/material";

export default function ItemList() {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Item Master
      </Typography>

      <Typography color="text.secondary">
        Manage brush items, sizes, bristle types, handles and pricing.
      </Typography>
    </Paper>
  );
}