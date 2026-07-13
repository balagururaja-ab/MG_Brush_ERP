import { useMemo } from "react";

import {
    Paper,
    Grid,
    Typography,
    TextField
} from "@mui/material";

export default function PurchaseSummary({ items }) {

    //-------------------------------------------------------
    // Calculate Totals
    //-------------------------------------------------------

    const totals = useMemo(() => {

        let subtotal = 0;
        let discount = 0;
        let taxable = 0;
        let cgst = 0;
        let sgst = 0;
        let igst = 0;
        let grand = 0;

        items.forEach((item) => {

            const qty = Number(item.quantity || 0);

            const rate = Number(item.rate || 0);

            const discountPercent = Number(
                item.discount_percent || 0
            );

            const taxPercent = Number(
                item.tax_percent || 0
            );

            const lineTotal = qty * rate;

            const discountAmount =
                lineTotal * discountPercent / 100;

            const taxableAmount =
                lineTotal - discountAmount;

            const gst =
                taxableAmount * taxPercent / 100;

            subtotal += lineTotal;
            discount += discountAmount;
            taxable += taxableAmount;

            cgst += gst / 2;
            sgst += gst / 2;

            grand += taxableAmount + gst;

        });

        return {

            subtotal: subtotal.toFixed(2),

            discount: discount.toFixed(2),

            taxable: taxable.toFixed(2),

            cgst: cgst.toFixed(2),

            sgst: sgst.toFixed(2),

            igst: igst.toFixed(2),

            grand: grand.toFixed(2)

        };

    }, [items]);

    //-------------------------------------------------------

    return (

        <Paper sx={{ mt: 3, p: 3 }}>

            <Typography
                variant="h6"
                gutterBottom
            >
                Purchase Summary
            </Typography>

            <Grid container spacing={2}>

                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        label="Subtotal"
                        value={totals.subtotal}
                        InputProps={{
                            readOnly: true
                        }}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        label="Discount"
                        value={totals.discount}
                        InputProps={{
                            readOnly: true
                        }}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        label="Taxable Amount"
                        value={totals.taxable}
                        InputProps={{
                            readOnly: true
                        }}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        label="CGST"
                        value={totals.cgst}
                        InputProps={{
                            readOnly: true
                        }}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        label="SGST"
                        value={totals.sgst}
                        InputProps={{
                            readOnly: true
                        }}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        label="IGST"
                        value={totals.igst}
                        InputProps={{
                            readOnly: true
                        }}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Grand Total"
                        value={totals.grand}
                        InputProps={{
                            readOnly: true
                        }}
                    />
                </Grid>

            </Grid>

        </Paper>

    );

}