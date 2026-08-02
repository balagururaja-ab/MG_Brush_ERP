import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
    Paper,
    Typography,
    Grid,
    Box,
    Button,
    Divider,
    CircularProgress,
    IconButton
} from "@mui/material";

import PrintIcon from "@mui/icons-material/Print";

import {
    DataGrid
} from "@mui/x-data-grid";

import MainLayout from "../../layouts/MainLayout";

import companyLogo from "../../assets/selvi_brush_logo.png";

import {
    getPurchase
} from "../../api/purchaseApi";

export default function PurchaseView() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [purchase, setPurchase] = useState(null);

    const [loading, setLoading] = useState(true);

    //---------------------------------------------------------
    // Load Purchase
    //---------------------------------------------------------

    useEffect(() => {

        loadPurchase();

    }, []);

    const loadPurchase = async () => {

        try {

            const data = await getPurchase(id);

            setPurchase(data);

        }
        catch (err) {

            console.error(err);

            alert("Unable to load purchase.");

        }
        finally {

            setLoading(false);

        }

    };

    const handlePrintReceipt = (payment) => {

        const printWindow = window.open("", "_blank", "width=900,height=700");

        if (!printWindow) {
            alert("Popup blocked. Please allow popups to print receipt.");
            return;
        }

        const receiptHtml = `
            <html>
                <head>
                    <title>Purchase Payment Receipt</title>
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

                    <h2>Purchase Payment Receipt</h2>

                    <table>
                        <tr><td class="label">Receipt No</td><td>${payment.receipt_no || "-"}</td></tr>
                        <tr><td class="label">Payment Date</td><td>${payment.payment_date || "-"}</td></tr>
                        <tr><td class="label">Supplier</td><td>${purchase?.supplier_name || "-"}</td></tr>
                        <tr><td class="label">Purchase No</td><td>${purchase?.purchase_no || "-"}</td></tr>
                        <tr><td class="label">Invoice No</td><td>${purchase?.invoice_no || "-"}</td></tr>
                        <tr><td class="label">Payment Mode</td><td>${payment.payment_mode || "-"}</td></tr>
                        <tr><td class="label">Reference</td><td>${payment.reference_no || "-"}</td></tr>
                        <tr><td class="label">Amount</td><td class="amount">₹ ${Number(payment.amount || 0).toFixed(2)}</td></tr>
                        <tr><td class="label">Remarks</td><td>${payment.remarks || "-"}</td></tr>
                    </table>
                </body>
            </html>
        `;

        printWindow.document.open();
        printWindow.document.write(receiptHtml);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();

    };
        //---------------------------------------------------------
    // Grid Columns
    //---------------------------------------------------------

    const columns = [

        {
            field: "line_no",
            headerName: "#",
            width: 70
        },

        {
            field: "item_name",
            headerName: "Item",
            flex: 1,
            minWidth: 220
        },

        {
            field: "item_spec",
            headerName: "Size / Type",
            width: 150
        },

        {
            field: "quantity",
            headerName: "Qty",
            width: 100,
            type: "number"
        },

        {
            field: "rate",
            headerName: "Rate",
            width: 110,
            type: "number"
        },

        {
            field: "discount_percent",
            headerName: "Disc %",
            width: 100
        },

        {
            field: "taxable_amount",
            headerName: "Taxable",
            width: 120
        },

        {
            field: "cgst_amount",
            headerName: "CGST",
            width: 100
        },

        {
            field: "sgst_amount",
            headerName: "SGST",
            width: 100
        },

        {
            field: "total_amount",
            headerName: "Total",
            width: 120
        }

    ];

    //---------------------------------------------------------
    // Loading
    //---------------------------------------------------------

    if (loading) {

        return (

            <MainLayout>

                <Box
                    display="flex"
                    justifyContent="center"
                    mt={5}
                >

                    <CircularProgress />

                </Box>

            </MainLayout>

        );

    }

    if (!purchase) {

        return (

            <MainLayout>

                <Typography>

                    Purchase not found.

                </Typography>

            </MainLayout>

        );

    }
        //---------------------------------------------------------
    // UI
    //---------------------------------------------------------

    const paymentColumns = [

        {
            field: "receipt_no",
            headerName: "Receipt No",
            width: 160
        },

        {
            field: "payment_date",
            headerName: "Date",
            width: 130
        },

        {
            field: "amount",
            headerName: "Amount",
            width: 120,
            type: "number"
        },

        {
            field: "payment_mode",
            headerName: "Mode",
            width: 120
        },

        {
            field: "reference_no",
            headerName: "Reference",
            width: 140
        },

        {
            field: "remarks",
            headerName: "Remarks",
            flex: 1,
            minWidth: 180
        },

        {
            field: "print",
            headerName: "Print",
            width: 90,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <IconButton
                    size="small"
                    onClick={() => handlePrintReceipt(params.row)}
                    aria-label="Print receipt"
                >
                    <PrintIcon fontSize="small" />
                </IconButton>
            )
        }

    ];

    return (

        <MainLayout>

            <Paper sx={{ p: 3 }}>

                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={3}
                >

                    <Typography
                        variant="h5"
                        fontWeight="bold"
                    >
                        Purchase Details
                    </Typography>

                    <Box>

                        <Button
                            variant="outlined"
                            sx={{ mr: 2 }}
                            onClick={() =>
                                navigate("/purchases")
                            }
                        >
                            Back
                        </Button>

                        <Button
                            variant="contained"
                            onClick={() =>
                                navigate(
                                    `/purchase/edit/${purchase.purchase_id}`
                                )
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
                    mb={3}
                >

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography fontWeight="bold">
                            Purchase No
                        </Typography>

                        <Typography>
                            {purchase.purchase_no}
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography fontWeight="bold">
                            Purchase Date
                        </Typography>

                        <Typography>
                            {purchase.purchase_date}
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography fontWeight="bold">
                            Supplier
                        </Typography>

                        <Typography>
                            {purchase.supplier_name || "-"}
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography fontWeight="bold">
                            Invoice No
                        </Typography>

                        <Typography>
                            {purchase.invoice_no || "-"}
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography fontWeight="bold">
                            Payment Status
                        </Typography>

                        <Typography>
                            {purchase.payment_status}
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Typography fontWeight="bold">
                            Remarks
                        </Typography>

                        <Typography>
                            {purchase.remarks || "-"}
                        </Typography>
                    </Grid>

                </Grid>

                <Typography
                    variant="h6"
                    mb={2}
                >
                    Purchase Items
                </Typography>

                <Box
                    sx={{
                        height: 400,
                        width: "100%",
                        mb: 3
                    }}
                >

                    <DataGrid

                        rows={purchase.items || []}

                        columns={columns}

                        getRowId={(row) =>
                            row.purchase_detail_id
                        }

                        hideFooter

                        disableRowSelectionOnClick

                    />

                </Box>

                <Divider sx={{ mb: 2 }} />

                <Box
                    display="flex"
                    justifyContent="flex-end"
                >

                    <Box
                        sx={{
                            width: 320
                        }}
                    >

                        <Typography>
                            <strong>Taxable Amount :</strong>{" "}
                            {purchase.taxable_amount ?? 0}
                        </Typography>

                        <Typography>
                            <strong>CGST :</strong>{" "}
                            {purchase.cgst_amount ?? 0}
                        </Typography>

                        <Typography>
                            <strong>SGST :</strong>{" "}
                            {purchase.sgst_amount ?? 0}
                        </Typography>

                        <Typography
                            variant="h6"
                            mt={2}
                        >
                            <strong>
                                Grand Total :
                            </strong>{" "}
                            {purchase.grand_total}
                        </Typography>

                    </Box>

                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography
                    variant="h6"
                    mb={2}
                >
                    Payment History
                </Typography>

                <Box
                    sx={{
                        height: 260,
                        width: "100%"
                    }}
                >

                    <DataGrid

                        rows={purchase.payments || []}

                        columns={paymentColumns}

                        getRowId={(row) => row.payment_id}

                        hideFooter

                        disableRowSelectionOnClick

                    />

                </Box>

            </Paper>

        </MainLayout>

    );

}