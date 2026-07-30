import { useEffect, useState } from "react";

import {
    Paper,
    Typography,
    Divider,
    Grid,
    Button,
    Box,
    TextField
} from "@mui/material";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";

import {
    getSale,
    generateSalesInvoice,
    recordSalesPayment
} from "../../api/salesApi";

export default function SalesView() {

    const navigate = useNavigate();

    const { id } = useParams();

    const [sales, setSales] = useState(null);
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [payment, setPayment] = useState({
        payment_date: new Date().toISOString().substring(0, 10),
        amount: 0,
        payment_mode: "",
        reference_no: "",
        remarks: ""
    });

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
            setPaymentHistory(data.payments || []);

        }
        catch (err) {

            console.error(err);

            alert("Unable to load sales.");

        }

    };

    const handleGenerateInvoice = async () => {

        try {

            await generateSalesInvoice(sales.sales_id, {
                invoice_date: sales.invoice_date || new Date().toISOString().substring(0, 10),
                is_gst: sales.is_gst || false,
                gst_percent: sales.gst_percent || 0
            });

            await loadSales();

            alert("Invoice generated successfully.");

        }
        catch (err) {

            console.error(err);

            alert(err.response?.data?.detail || "Unable to generate invoice.");

        }

    };

    const handlePaymentChange = (e) => {

        const { name, value, type } = e.target;

        setPayment(prev => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value
        }));

    };

    const handleRecordPayment = async () => {

        try {

            if (!payment.amount || payment.amount <= 0) {
                alert("Enter a valid payment amount.");
                return;
            }

            const response = await recordSalesPayment(sales.sales_id, payment);

            await loadSales();

            setPayment(prev => ({ ...prev, amount: 0, remarks: "", reference_no: "", payment_mode: "" }));

            const receiptNo = response?.payment_summary?.receipt_no;
            alert(
                receiptNo
                    ? `Payment recorded successfully. Receipt: ${receiptNo}`
                    : "Payment recorded successfully."
            );

        }
        catch (err) {

            console.error(err);

            alert(err.response?.data?.detail || "Unable to record payment.");

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

    const canGenerateInvoice = !sales.invoice_generated;

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

                    <Grid size={{ xs: 12, md: 3 }}>

                        <Typography
                            fontWeight="bold"
                        >

                            GST Applied

                        </Typography>

                        <Typography>

                            {sales.is_gst ? "Yes" : "No"}

                        </Typography>

                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>

                        <Typography
                            fontWeight="bold"
                        >

                            GST %

                        </Typography>

                        <Typography>

                            {sales.gst_percent ?? 0}

                        </Typography>

                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>

                        <Typography
                            fontWeight="bold"
                        >

                            Paid Amount

                        </Typography>

                        <Typography>

                            ₹ {Number(sales.paid_amount || 0).toFixed(2)}

                        </Typography>

                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>

                        <Typography
                            fontWeight="bold"
                        >

                            Pending Amount

                        </Typography>

                        <Typography>

                            ₹ {Number(sales.pending_amount || 0).toFixed(2)}

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
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                >
                    Apply discount in Edit mode under Sales Items using the Disc % column,
                    then save and generate invoice. Payment can be recorded as partial or full.
                </Typography>

                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={3}
                >
                    <Typography
                        variant="h6"
                        fontWeight="bold"
                    >
                        Sales Items
                    </Typography>

                    <Box>
                        <Button
                            variant="contained"
                            color={sales.invoice_generated ? "success" : "primary"}
                            disabled={!canGenerateInvoice}
                            onClick={handleGenerateInvoice}
                        >
                            {sales.invoice_generated
                                ? "Invoice Generated"
                                : "Generate Invoice"}
                        </Button>
                    </Box>
                </Box>

                <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                >
                    Record a payment against this sale below.
                </Typography>

                <Grid
                    container
                    spacing={2}
                    sx={{ mb: 3 }}
                >
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            fullWidth
                            label="Payment Date"
                            type="date"
                            name="payment_date"
                            value={payment.payment_date}
                            onChange={handlePaymentChange}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Amount"
                            name="amount"
                            value={payment.amount}
                            onChange={handlePaymentChange}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            fullWidth
                            label="Payment Mode"
                            name="payment_mode"
                            value={payment.payment_mode}
                            onChange={handlePaymentChange}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            fullWidth
                            label="Reference No"
                            name="reference_no"
                            value={payment.reference_no}
                            onChange={handlePaymentChange}
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Remarks"
                            name="remarks"
                            value={payment.remarks}
                            onChange={handlePaymentChange}
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <Button
                            variant="contained"
                            onClick={handleRecordPayment}
                            disabled={Number(sales.pending_amount || 0) <= 0}
                        >
                            Record Payment
                        </Button>
                    </Grid>
                </Grid>

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

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                >
                    Payment History
                </Typography>

                {paymentHistory.length === 0 ? (
                    <Typography color="text.secondary">
                        No payment entries recorded yet.
                    </Typography>
                ) : (
                    <Box sx={{ overflowX: "auto" }}>
                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse"
                            }}
                        >
                            <thead>
                                <tr>
                                    <th align="left">Receipt</th>
                                    <th align="left">Date</th>
                                    <th align="right">Amount</th>
                                    <th align="left">Mode</th>
                                    <th align="left">Reference</th>
                                    <th align="left">Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paymentHistory.map((entry) => (
                                    <tr key={entry.payment_id}>
                                        <td>{entry.receipt_no || "-"}</td>
                                        <td>{entry.payment_date}</td>
                                        <td align="right">₹ {Number(entry.amount || 0).toFixed(2)}</td>
                                        <td>{entry.payment_mode || "-"}</td>
                                        <td>{entry.reference_no || "-"}</td>
                                        <td>{entry.remarks || "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Box>
                )}

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