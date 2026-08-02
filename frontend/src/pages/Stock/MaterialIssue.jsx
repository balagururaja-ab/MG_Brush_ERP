import { useEffect, useState } from "react";

import {
    Paper,
    Typography,
    Grid,
    TextField,
    MenuItem,
    Button,
    Divider,
    Alert
} from "@mui/material";

import MainLayout from "../../layouts/MainLayout";
import { getItems } from "../../api/itemApi";
import { saveMaterialIssue } from "../../api/stockApi";

const isBristleMaterial = (item) => {

    const text = String(item?.item_name || "").toLowerCase();

    return (
        text.includes("bristle")
        || text.includes("hog")
        || text.includes("taper")
        || text.includes("magic")
    );
};

export default function MaterialIssue() {

    const [items, setItems] = useState([]);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const [form, setForm] = useState({
        issue_date: new Date().toISOString().substring(0, 10),
        batch_no: "",
        item_id: "",
        quantity: "",
        remarks: ""
    });

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {

        try {

            const data = await getItems();
            setItems(data.filter(isBristleMaterial));

        }
        catch (error) {
            console.error(error);
        }

    };

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));

    };

    const handleSubmit = async () => {

        setMessage("");

        if (!form.item_id) {
            setMessage("Please select a raw material item.");
            return;
        }

        if (!form.quantity || Number(form.quantity) <= 0) {
            setMessage("Issue quantity must be greater than zero.");
            return;
        }

        try {

            setSaving(true);

            await saveMaterialIssue({
                item_id: Number(form.item_id),
                quantity: Number(form.quantity),
                issue_date: form.issue_date,
                batch_no: form.batch_no || null,
                remarks: form.remarks || null
            });

            setMessage("Material issue recorded successfully.");

            setForm((prev) => ({
                ...prev,
                batch_no: "",
                item_id: "",
                quantity: "",
                remarks: ""
            }));

        }
        catch (error) {

            console.error(error);

            setMessage(
                error.response?.data?.detail
                || "Unable to save material issue."
            );

        }
        finally {
            setSaving(false);
        }

    };

    return (

        <MainLayout>

            <Paper
                elevation={3}
                sx={{ p: 3 }}
            >

                <Typography
                    variant="h5"
                    gutterBottom
                >
                    Material Issue (RM Consumption)
                </Typography>

                <Typography color="text.secondary" sx={{ mb: 2 }}>
                    Record bristle/raw material consumption by batch, date, and remarks.
                </Typography>

                <Divider sx={{ mb: 3 }} />

                {!!message && (
                    <Alert
                        severity={message.toLowerCase().includes("success") ? "success" : "info"}
                        sx={{ mb: 2 }}
                    >
                        {message}
                    </Alert>
                )}

                <Grid container spacing={2}>

                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            fullWidth
                            label="Issue Date"
                            name="issue_date"
                            type="date"
                            value={form.issue_date}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            fullWidth
                            label="Batch No"
                            name="batch_no"
                            value={form.batch_no}
                            onChange={handleChange}
                            placeholder="Optional"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            select
                            fullWidth
                            label="Raw Material"
                            name="item_id"
                            value={form.item_id}
                            onChange={handleChange}
                        >
                            {items.map((item) => (
                                <MenuItem key={item.item_id} value={item.item_id}>
                                    {item.item_code} - {item.item_name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            fullWidth
                            label="Quantity (Kg)"
                            name="quantity"
                            type="number"
                            value={form.quantity}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 9 }}>
                        <TextField
                            fullWidth
                            label="Remarks"
                            name="remarks"
                            value={form.remarks}
                            onChange={handleChange}
                            multiline
                            rows={2}
                        />
                    </Grid>

                </Grid>

                <Button
                    sx={{ mt: 3 }}
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={saving}
                >
                    {saving ? "Saving..." : "Save Material Issue"}
                </Button>

            </Paper>

        </MainLayout>

    );

}