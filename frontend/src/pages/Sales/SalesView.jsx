import { useEffect, useState } from "react";

import {
    Paper,
    Typography,
    Divider,
    Grid,
    Button,
    Box
} from "@mui/material";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";

import { getSale } from "../../api/salesApi";

export default function SalesView() {

    const navigate = useNavigate();

    const { id } = useParams();

    const [sales, setSales] = useState(null);

    //---------------------------------------------------------
    // Load Sales
    //---------------------------------------------------------

    useEffect(() => {

        loadSales();

    }, []);

    const loadSales = async () => {

        try {

            const data = await getSale(id);

            setSales(data);

        }
        catch (err) {

            console.error(err);

            alert("Unable to load sales.");

        }

    };

    if (!sales) {

        return (

            <MainLayout>

                <Typography>

                    Loading...

                </Typography>

            </MainLayout>

        );

    }
        //---------------------------------------------------------
    // UI
    //---------------------------------------------------------

    return (

        <MainLayout>

            <Paper sx={{ p: 3 }}>

                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >

                    <Typography
                        variant="h5"
                        fontWeight="bold"
                    >

                        Sales Details

                    </Typography>

                    <Box>

                        <Button

                            variant="outlined"

                            sx={{ mr: 2 }}

                            onClick={() =>
                                navigate("/sales")
                            }

                        >

                            Back

                        </Button>

                        <Button

                            variant="contained"

                            onClick={() =>
                                navigate(`/sales/edit/${sales.sales_id}`)
                            }

                        >

                            Edit

                        </Button>

                    </Box>

                </Box>

                <Divider sx={{ mb: 3 }} />

                <Grid
                    container
                    spacing={2}
                >

                    <Grid size={{ xs: 12, md: 3 }}>

                        <Typography
                            fontWeight="bold"
                        >

                            Sales No

                        </Typography>

                        <Typography>

                            {sales.sales_no}

                        </Typography>

                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>

                        <Typography
                            fontWeight="bold"
                        >

                            Sales Date

                        </Typography>

                        <Typography>

                            {sales.sales_date}

                        </Typography>

                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>

                        <Typography
                            fontWeight="bold"
                        >

                            Customer

                        </Typography>

                        <Typography>

                            {sales.customer_name}

                        </Typography>

                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>

                        <Typography
                            fontWeight="bold"
                        >

                            Payment Status

                        </Typography>

                        <Typography>

                            {sales.payment_status}

                        </Typography>

                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>

                        <Typography
                            fontWeight="bold"
                        >

                            Invoice No

                        </Typography>

                        <Typography>

                            {sales.invoice_no}

                        </Typography>

                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>

                        <Typography
                            fontWeight="bold"
                        >

                            Invoice Date

                        </Typography>

                        <Typography>

                            {sales.invoice_date}

                        </Typography>

                    </Grid>

                    <Grid size={{ xs: 12 }}>

                        <Typography
                            fontWeight="bold"
                        >

                            Remarks

                        </Typography>

                        <Typography>

                            {sales.remarks}

                        </Typography>

                    </Grid>

                </Grid>

                <Divider sx={{ my: 3 }} />
                                <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                >
                    Sales Items
                </Typography>

                <Box sx={{ overflowX: "auto" }}>

                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse"
                        }}
                    >

                        <thead>

                            <tr>

                                <th align="left">Item</th>

                                <th align="right">Qty</th>

                                <th align="right">Rate</th>

                                <th align="right">Discount</th>

                                <th align="right">Taxable</th>

                                <th align="right">CGST</th>

                                <th align="right">SGST</th>

                                <th align="right">IGST</th>

                                <th align="right">Total</th>

                            </tr>

                        </thead>

                        <tbody>

                            {sales.items?.map((item, index) => (

                                <tr key={index}>

                                    <td>

                                        {item.item_name}

                                    </td>

                                    <td align="right">

                                        {item.quantity}

                                    </td>

                                    <td align="right">

                                        {Number(item.rate).toFixed(2)}

                                    </td>

                                    <td align="right">

                                        {Number(item.discount_amount).toFixed(2)}

                                    </td>

                                    <td align="right">

                                        {Number(item.taxable_amount).toFixed(2)}

                                    </td>

                                    <td align="right">

                                        {Number(item.cgst_amount).toFixed(2)}

                                    </td>

                                    <td align="right">

                                        {Number(item.sgst_amount).toFixed(2)}

                                    </td>

                                    <td align="right">

                                        {Number(item.igst_amount).toFixed(2)}

                                    </td>

                                    <td align="right">

                                        <b>

                                            {Number(item.total_amount).toFixed(2)}

                                        </b>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </Box>

                <Divider sx={{ my: 3 }} />

                <Box
                    display="flex"
                    justifyContent="flex-end"
                >

                    <Typography
                        variant="h6"
                        fontWeight="bold"
                    >

                        Grand Total : ₹{" "}

                        {Number(
                            sales.grand_total
                        ).toFixed(2)}

                    </Typography>

                </Box>

            </Paper>

        </MainLayout>

    );

}