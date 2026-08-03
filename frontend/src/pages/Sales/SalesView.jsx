import { useEffect, useState } from "react";

import {
    Paper,
    Typography,
    Divider,
    Grid,
    Button,
    Box,
    TextField,
    IconButton
} from "@mui/material";

import PrintIcon from "@mui/icons-material/Print";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";

import {
    getSale,
    generateSalesInvoice,
    recordSalesPayment,
    getSalesPaymentReceipt
} from "../../api/salesApi";

import companyLogo from "../../assets/selvi_brush_logo.png";

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

    const [invoiceDraft, setInvoiceDraft] = useState({
        invoice_date: new Date().toISOString().substring(0, 10),
        is_gst: false,
        gst_percent: 0
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
            setInvoiceDraft({
                invoice_date: data.invoice_date || new Date().toISOString().substring(0, 10),
                is_gst: Boolean(data.is_gst),
                gst_percent: Number(data.gst_percent || 0)
            });

        }
        catch (err) {

            console.error(err);

            alert("Unable to load sales.");

        }

    };

    const handleGenerateInvoice = async () => {

        try {

            if (invoiceDraft.is_gst && Number(invoiceDraft.gst_percent || 0) <= 0) {
                alert("Enter valid GST % for GST invoice.");
                return;
            }

            await generateSalesInvoice(sales.sales_id, {
                invoice_date: invoiceDraft.invoice_date,
                is_gst: invoiceDraft.is_gst,
                gst_percent: invoiceDraft.is_gst ? Number(invoiceDraft.gst_percent || 0) : 0
            });

            await loadSales();

            alert("Invoice generated successfully.");

        }
        catch (err) {

            console.error(err);

            alert(err.response?.data?.detail || "Unable to generate invoice.");

        }

    };

    const handleInvoiceDraftChange = (e) => {

        const { name, value, type } = e.target;

        setInvoiceDraft((prev) => ({
            ...prev,
            [name]: type === "number"
                ? Number(value)
                : (name === "is_gst" ? value === "true" : value)
        }));

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

            if (!sales.invoice_generated) {
                alert("Generate invoice before recording payment.");
                return;
            }

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

    const handlePrintInvoice = () => {

        if (!sales.invoice_generated) {
            alert("Generate invoice before printing.");
            return;
        }

        const isGstInvoice = Boolean(sales.is_gst);
        const taxable = Number(sales.taxable_amount || 0);
        const cgst = isGstInvoice ? Number(sales.cgst_amount || 0) : 0;
        const sgst = isGstInvoice ? Number(sales.sgst_amount || 0) : 0;
        const igst = isGstInvoice ? Number(sales.igst_amount || 0) : 0;
        const grandTotal = isGstInvoice
            ? Number(sales.grand_total || 0)
            : taxable;

        const printWindow = window.open("", "_blank", "width=1000,height=760");
        if (!printWindow) {
            alert("Popup blocked. Please allow popups to print invoice.");
            return;
        }

        const rowsHtml = (sales.items || []).map((item, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${item.item_name || "-"}</td>
                <td style="text-align:right;">${Number(item.quantity || 0).toFixed(2)}</td>
                <td style="text-align:right;">${Number(item.rate || 0).toFixed(2)}</td>
                <td style="text-align:right;">${Number(item.discount_amount || 0).toFixed(2)}</td>
                <td style="text-align:right;">${Number(item.taxable_amount || 0).toFixed(2)}</td>
                ${isGstInvoice ? `<td style="text-align:right;">${Number(item.cgst_amount || 0).toFixed(2)}</td>` : ""}
                ${isGstInvoice ? `<td style="text-align:right;">${Number(item.sgst_amount || 0).toFixed(2)}</td>` : ""}
                ${isGstInvoice ? `<td style="text-align:right;">${Number(item.igst_amount || 0).toFixed(2)}</td>` : ""}
                <td style="text-align:right; font-weight:700;">${Number(item.total_amount || 0).toFixed(2)}</td>
            </tr>
        `).join("");

        const invoiceHtml = `
            <html>
                <head>
                    <title>Sales Invoice</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; color: #222; }
                        .header { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
                        .logo { width: 62px; height: 62px; object-fit: contain; }
                        .company { margin: 0; font-size: 24px; font-weight: 700; }
                        .muted { color: #666; margin: 0; }
                        .meta { margin-top: 12px; margin-bottom: 18px; display: grid; grid-template-columns: 1fr 1fr; gap: 6px 24px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 8px; }
                        th, td { border: 1px solid #ddd; padding: 8px; font-size: 13px; }
                        th { background: #f5f5f5; }
                        .summary { margin-top: 14px; width: 360px; margin-left: auto; }
                        .summary td { border: 1px solid #ddd; padding: 8px; }
                        .summary .label { font-weight: 600; background: #f7f7f7; }
                        .summary .total { font-size: 18px; font-weight: 700; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <img class="logo" src="${companyLogo}" alt="MG Brush ERP Logo" />
                        <div>
                            <p class="company">MG Brush ERP</p>
                            <p class="muted">Sales Invoice</p>
                        </div>
                    </div>

                    <div class="meta">
                        <div><b>Invoice No:</b> ${sales.invoice_no || "-"}</div>
                        <div><b>Invoice Date:</b> ${sales.invoice_date || "-"}</div>
                        <div><b>Sales No:</b> ${sales.sales_no || "-"}</div>
                        <div><b>Sales Date:</b> ${sales.sales_date || "-"}</div>
                        <div><b>Customer:</b> ${sales.customer_name || "-"}</div>
                        <div><b>GST Invoice:</b> ${isGstInvoice ? "Yes" : "No"}</div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Item</th>
                                <th style="text-align:right;">Qty</th>
                                <th style="text-align:right;">Rate</th>
                                <th style="text-align:right;">Discount</th>
                                <th style="text-align:right;">Taxable</th>
                                ${isGstInvoice ? '<th style="text-align:right;">CGST</th>' : ""}
                                ${isGstInvoice ? '<th style="text-align:right;">SGST</th>' : ""}
                                ${isGstInvoice ? '<th style="text-align:right;">IGST</th>' : ""}
                                <th style="text-align:right;">Total</th>
                            </tr>
                        </thead>
                        <tbody>${rowsHtml}</tbody>
                    </table>

                    <table class="summary">
                        <tr><td class="label">Taxable Amount</td><td style="text-align:right;">₹ ${taxable.toFixed(2)}</td></tr>
                        ${isGstInvoice ? `<tr><td class="label">CGST</td><td style="text-align:right;">₹ ${cgst.toFixed(2)}</td></tr>` : ""}
                        ${isGstInvoice ? `<tr><td class="label">SGST</td><td style="text-align:right;">₹ ${sgst.toFixed(2)}</td></tr>` : ""}
                        ${isGstInvoice ? `<tr><td class="label">IGST</td><td style="text-align:right;">₹ ${igst.toFixed(2)}</td></tr>` : ""}
                        <tr><td class="label total">Grand Total</td><td class="total" style="text-align:right;">₹ ${grandTotal.toFixed(2)}</td></tr>
                    </table>
                </body>
            </html>
        `;

        printWindow.document.open();
        printWindow.document.write(invoiceHtml);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();

    };

    const handlePrintPaymentReceipt = async (paymentId) => {

        try {

            const receipt = await getSalesPaymentReceipt(
                sales.sales_id,
                paymentId
            );

            const printWindow = window.open("", "_blank", "width=900,height=700");

            if (!printWindow) {
                alert("Popup blocked. Please allow popups to print receipt.");
                return;
            }

            const receiptHtml = `
                <html>
                    <head>
                        <title>Sales Payment Receipt</title>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 24px; color: #222; }
                            .header { display: flex; align-items: center; gap: 14px; margin-bottom: 8px; }
                            .logo { width: 64px; height: 64px; object-fit: contain; }
                            .company { font-size: 24px; font-weight: 700; margin: 0; }
                            h2 { margin-bottom: 8px; }
                            .muted { color: #666; margin-bottom: 18px; }
                            table { width: 100%; border-collapse: collapse; margin-top: 14px; }
                            td { padding: 8px; border: 1px solid #ddd; vertical-align: top; }
                            .label { width: 35%; font-weight: 600; background: #f7f7f7; }
                            .amount { font-size: 20px; font-weight: 700; }
                        </style>
                    </head>
                    <body>
                        <div class="header">
                            <img class="logo" src="${companyLogo}" alt="MG Brush ERP Logo" />
                            <div>
                                <p class="company">MG Brush ERP</p>
                                <div class="muted">Generated from MG Brush ERP</div>
                            </div>
                        </div>

                        <h2>Sales Payment Receipt</h2>

                        <table>
                            <tr><td class="label">Receipt No</td><td>${receipt.receipt_no || "-"}</td></tr>
                            <tr><td class="label">Payment Date</td><td>${receipt.payment_date || "-"}</td></tr>
                            <tr><td class="label">Customer</td><td>${receipt.customer_name || "-"}</td></tr>
                            <tr><td class="label">Sales No</td><td>${receipt.sales_no || "-"}</td></tr>
                            <tr><td class="label">Invoice No</td><td>${receipt.invoice_no || "-"}</td></tr>
                            <tr><td class="label">Payment Mode</td><td>${receipt.payment_mode || "-"}</td></tr>
                            <tr><td class="label">Reference</td><td>${receipt.reference_no || "-"}</td></tr>
                            <tr><td class="label">Amount</td><td class="amount">₹ ${Number(receipt.amount || 0).toFixed(2)}</td></tr>
                            <tr><td class="label">Remarks</td><td>${receipt.remarks || "-"}</td></tr>
                        </table>
                    </body>
                </html>
            `;

            printWindow.document.open();
            printWindow.document.write(receiptHtml);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();

        }
        catch (err) {

            console.error(err);

            alert(err.response?.data?.detail || "Unable to print payment receipt.");

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
                        <TextField
                            sx={{ mr: 2, minWidth: 140 }}
                            label="Invoice Date"
                            type="date"
                            name="invoice_date"
                            value={invoiceDraft.invoice_date}
                            onChange={handleInvoiceDraftChange}
                            InputLabelProps={{ shrink: true }}
                            size="small"
                            disabled={sales.invoice_generated}
                        />
                        <TextField
                            sx={{ mr: 2, minWidth: 140 }}
                            select
                            label="GST"
                            name="is_gst"
                            value={invoiceDraft.is_gst ? "true" : "false"}
                            onChange={handleInvoiceDraftChange}
                            size="small"
                            disabled={sales.invoice_generated}
                        >
                            <MenuItem value="false">Without GST</MenuItem>
                            <MenuItem value="true">With GST</MenuItem>
                        </TextField>
                        <TextField
                            sx={{ mr: 2, width: 110 }}
                            label="GST %"
                            type="number"
                            name="gst_percent"
                            value={invoiceDraft.gst_percent}
                            onChange={handleInvoiceDraftChange}
                            size="small"
                            disabled={sales.invoice_generated || !invoiceDraft.is_gst}
                        />
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
                        <Button
                            variant="outlined"
                            sx={{ ml: 2 }}
                            onClick={handlePrintInvoice}
                            disabled={!sales.invoice_generated}
                        >
                            Print Invoice
                        </Button>
                    </Box>
                </Box>

                <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                >
                    Record payment only after invoice generation.
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
                            disabled={!sales.invoice_generated || Number(sales.pending_amount || 0) <= 0}
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
                                    <th align="center">Print</th>
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
                                        <td align="center">
                                            <IconButton
                                                size="small"
                                                onClick={() => handlePrintPaymentReceipt(entry.payment_id)}
                                                aria-label="Print receipt"
                                                disabled={!sales.invoice_generated}
                                            >
                                                <PrintIcon fontSize="small" />
                                            </IconButton>
                                        </td>
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