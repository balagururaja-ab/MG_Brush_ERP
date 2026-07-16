import {
    Paper,
    Typography,
    Grid,
    Divider
} from "@mui/material";

export default function SalesSummary({

    items

}) {

    //---------------------------------------------------------
    // Calculations
    //---------------------------------------------------------

    const grossAmount = items.reduce(

        (sum, row) =>

            sum +

            (Number(row.quantity || 0) *

             Number(row.rate || 0)),

        0

    );

    const discountAmount = items.reduce(

        (sum, row) =>

            sum +

            Number(row.discount_amount || 0),

        0

    );

    const taxableAmount = items.reduce(

        (sum, row) =>

            sum +

            Number(row.taxable_amount || 0),

        0

    );

    const cgstAmount = items.reduce(

        (sum, row) =>

            sum +

            Number(row.cgst_amount || 0),

        0

    );

    const sgstAmount = items.reduce(

        (sum, row) =>

            sum +

            Number(row.sgst_amount || 0),

        0

    );

    const igstAmount = items.reduce(

        (sum, row) =>

            sum +

            Number(row.igst_amount || 0),

        0

    );

    const grandTotal = items.reduce(

        (sum, row) =>

            sum +

            Number(row.total_amount || 0),

        0

    );

    //---------------------------------------------------------
    // UI
    //---------------------------------------------------------

    return (

        <Paper

            sx={{

                mt: 3,

                p: 3

            }}

        >

            <Typography

                variant="h6"

                fontWeight="bold"

                gutterBottom

            >

                Sales Summary

            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Grid
                container
                spacing={2}
            >

                <Grid size={{ xs: 6 }}>

                    <Typography>
                        Gross Amount
                    </Typography>

                </Grid>

                <Grid size={{ xs: 6 }}>

                    <Typography
                        align="right"
                    >
                        ₹ {grossAmount.toFixed(2)}
                    </Typography>

                </Grid>

                <Grid size={{ xs: 6 }}>

                    <Typography>
                        Discount
                    </Typography>

                </Grid>

                <Grid size={{ xs: 6 }}>

                    <Typography
                        align="right"
                    >
                        ₹ {discountAmount.toFixed(2)}
                    </Typography>

                </Grid>

                <Grid size={{ xs: 6 }}>

                    <Typography>
                        Taxable Amount
                    </Typography>

                </Grid>

                <Grid size={{ xs: 6 }}>

                    <Typography
                        align="right"
                    >
                        ₹ {taxableAmount.toFixed(2)}
                    </Typography>

                </Grid>

                <Grid size={{ xs: 6 }}>

                    <Typography>
                        CGST
                    </Typography>

                </Grid>

                <Grid size={{ xs: 6 }}>

                    <Typography
                        align="right"
                    >
                        ₹ {cgstAmount.toFixed(2)}
                    </Typography>

                </Grid>

                <Grid size={{ xs: 6 }}>

                    <Typography>
                        SGST
                    </Typography>

                </Grid>

                <Grid size={{ xs: 6 }}>

                    <Typography
                        align="right"
                    >
                        ₹ {sgstAmount.toFixed(2)}
                    </Typography>

                </Grid>

                <Grid size={{ xs: 6 }}>

                    <Typography>
                        IGST
                    </Typography>

                </Grid>

                <Grid size={{ xs: 6 }}>

                    <Typography
                        align="right"
                    >
                        ₹ {igstAmount.toFixed(2)}
                    </Typography>

                </Grid>

                <Grid size={{ xs: 12 }}>

                    <Divider />

                </Grid>

                <Grid size={{ xs: 6 }}>

                    <Typography

                        variant="h6"

                        fontWeight="bold"

                    >

                        Grand Total

                    </Typography>

                </Grid>

                <Grid size={{ xs: 6 }}>

                    <Typography

                        variant="h6"

                        fontWeight="bold"

                        align="right"

                    >

                        ₹ {grandTotal.toFixed(2)}

                    </Typography>

                </Grid>

            </Grid>

        </Paper>

    );

}