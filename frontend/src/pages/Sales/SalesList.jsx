import { useEffect, useState } from "react";

import {
    Paper,
    Typography,
    Button,
    Box,
    TextField,
    IconButton,
    Grid,
    Card,
    CardContent,
    FormControlLabel,
    Switch,
    Chip
} from "@mui/material";

import {
    DataGrid
} from "@mui/x-data-grid";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

import {
    useNavigate
} from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";

import {
    getSales,
    deleteSales,
    getSalesPendingSummary
} from "../../api/salesApi";

export default function SalesList() {

    const navigate = useNavigate();

    const [rows, setRows] = useState([]);

    const [pendingSummary, setPendingSummary] = useState([]);

    const [loading, setLoading] = useState(false);

    const [summaryLoading, setSummaryLoading] = useState(false);

    const [search, setSearch] = useState("");

    const [pendingOnly, setPendingOnly] = useState(false);

    const [selectedCustomerId, setSelectedCustomerId] = useState(null);

    //---------------------------------------------------------
    // Load Sales
    //---------------------------------------------------------

    useEffect(() => {

        loadSales();

        loadPendingSummary();

    }, []);

    const loadSales = async () => {

        try {

            setLoading(true);

            const data = await getSales();

            setRows(data);

        }
        catch (err) {

            console.error(err);

        }
        finally {

            setLoading(false);

        }

    };

    const loadPendingSummary = async () => {

        try {

            setSummaryLoading(true);

            const data = await getSalesPendingSummary();

            setPendingSummary(data || []);

        }
        catch (err) {

            console.error(err);

        }
        finally {

            setSummaryLoading(false);

        }

    };

    //---------------------------------------------------------
    // Delete Sales
    //---------------------------------------------------------

    const handleDelete = async (salesId) => {

        if (!window.confirm(
            "Delete this sales invoice?"
        )) {

            return;

        }

        try {

            await deleteSales(
                salesId
            );

            loadSales();

        }
        catch (err) {

            console.error(err);

            alert(

                err.response?.data?.detail ||

                "Unable to delete sales."

            );

        }

    };

    //---------------------------------------------------------
    // Filter
    //---------------------------------------------------------

    const filteredRows = rows.filter((row) => {

        const query = search.toLowerCase();

        const matchesSearch = (
            row.sales_no
                ?.toLowerCase()
                .includes(query)
            ||
            row.customer_name
                ?.toLowerCase()
                .includes(query)
            ||
            row.invoice_no
                ?.toLowerCase()
                .includes(query)
        );

        if (!matchesSearch) {
            return false;
        }

        if (pendingOnly && Number(row.pending_amount || 0) <= 0) {
            return false;
        }

        if (
            selectedCustomerId !== null
            && Number(row.customer_id) !== Number(selectedCustomerId)
        ) {
            return false;
        }

        return true;

    });

    const totalReceivable = rows.reduce(
        (sum, row) => sum + Number(row.pending_amount || 0),
        0
    );

    const pendingInvoices = rows.filter(
        (row) => Number(row.pending_amount || 0) > 0
    ).length;

    const partialInvoices = rows.filter(
        (row) => row.payment_status === "PARTIAL"
    ).length;

    const customersWithPending = pendingSummary.length;

    const summaryColumns = [
        {
            field: "customer_name",
            headerName: "Customer",
            flex: 1,
            minWidth: 200
        },
        {
            field: "pending_sales",
            headerName: "Pending Invoices",
            width: 150,
            type: "number"
        },
        {
            field: "total_pending",
            headerName: "Total Pending",
            width: 170,
            type: "number",
            renderCell: (params) => (
                <b>
                    ₹ {
                        Number(params.row.total_pending || 0).toLocaleString(
                            "en-IN",
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }
                        )
                    }
                </b>
            )
        },
        {
            field: "actions",
            headerName: "Action",
            width: 180,
            sortable: false,
            renderCell: (params) => (
                <Button
                    size="small"
                    variant={
                        Number(selectedCustomerId) === Number(params.row.customer_id)
                            ? "contained"
                            : "outlined"
                    }
                    onClick={() => {
                        if (Number(selectedCustomerId) === Number(params.row.customer_id)) {
                            setSelectedCustomerId(null);
                            return;
                        }
                        setSelectedCustomerId(params.row.customer_id);
                    }}
                >
                    {
                        Number(selectedCustomerId) === Number(params.row.customer_id)
                            ? "Clear"
                            : "View Invoices"
                    }
                </Button>
            )
        }
    ];
        //---------------------------------------------------------
    // Grid Columns
    //---------------------------------------------------------

    const columns = [

        {
            field: "sales_no",
            headerName: "Sales No",
            width: 150
        },

        {
            field: "sales_date",
            headerName: "Sales Date",
            width: 140
        },

        {
            field: "customer_name",
            headerName: "Customer",
            flex: 1,
            minWidth: 220
        },

        {
            field: "invoice_no",
            headerName: "Invoice No",
            width: 150
        },

        {
            field: "paid_amount",
            headerName: "Paid",
            width: 120,
            type: "number"
        },

        {
            field: "pending_amount",
            headerName: "Pending",
            width: 130,
            type: "number"
        },

        {
            field: "grand_total",
            headerName: "Grand Total",
            width: 150,
            type: "number"
        },

        {
            field: "payment_status",
            headerName: "Status",
            width: 130
        },

        {
            field: "actions",

            headerName: "Actions",

            width: 170,

            sortable: false,

            renderCell: (params) => (

                <>

                    <IconButton

                        color="primary"

                        onClick={() =>
                            navigate(
                                `/sales/${params.row.sales_id}`
                            )
                        }

                    >

                        <VisibilityIcon />

                    </IconButton>

                    <IconButton

                        color="warning"

                        onClick={() =>
                            navigate(
                                `/sales/edit/${params.row.sales_id}`
                            )
                        }

                    >

                        <EditIcon />

                    </IconButton>

                    <IconButton

                        color="error"

                        onClick={() =>
                            handleDelete(
                                params.row.sales_id
                            )
                        }

                    >

                        <DeleteIcon />

                    </IconButton>

                </>

            )

        }

    ];
        //---------------------------------------------------------
    // UI
    //---------------------------------------------------------

    return (

        <MainLayout>

            <Paper sx={{ p: 3 }}>

                <Box

                    sx={{

                        display: "flex",

                        justifyContent: "space-between",

                        alignItems: "center",

                        mb: 3

                    }}

                >

                    <Typography

                        variant="h5"

                        fontWeight="bold"

                    >

                        Sales List

                    </Typography>

                    <Chip
                        label={`Rows: ${filteredRows.length}`}
                        color="primary"
                        variant="outlined"
                    />


                </Box>

                <Grid container spacing={2} sx={{ mb: 2 }}>

                    <Grid item xs={12} md={3}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="body2" color="text.secondary">
                                    Total Receivable
                                </Typography>
                                <Typography variant="h6" fontWeight="bold">
                                    ₹ {
                                        totalReceivable.toLocaleString("en-IN", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })
                                    }
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="body2" color="text.secondary">
                                    Customers With Pending
                                </Typography>
                                <Typography variant="h6" fontWeight="bold">
                                    {customersWithPending}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="body2" color="text.secondary">
                                    Pending Invoices
                                </Typography>
                                <Typography variant="h6" fontWeight="bold">
                                    {pendingInvoices}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="body2" color="text.secondary">
                                    Partial Invoices
                                </Typography>
                                <Typography variant="h6" fontWeight="bold">
                                    {partialInvoices}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                </Grid>

                <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ mb: 1 }}
                >
                    Customer Due Summary
                </Typography>

                <Box
                    sx={{
                        height: 260,
                        width: "100%",
                        mb: 2
                    }}
                >

                    <DataGrid

                        rows={pendingSummary}

                        columns={summaryColumns}

                        loading={summaryLoading}

                        getRowId={(row) =>
                            row.customer_id
                        }

                        pageSizeOptions={[5, 10, 20]}

                        initialState={{

                            pagination: {

                                paginationModel: {

                                    pageSize: 5

                                }

                            }

                        }}

                        disableRowSelectionOnClick

                    />

                </Box>

                <Box sx={{ mb: 2 }}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={pendingOnly}
                                onChange={(e) =>
                                    setPendingOnly(e.target.checked)
                                }
                            />
                        }
                        label="Show Pending Invoices Only"
                    />
                    {
                        selectedCustomerId !== null && (
                            <Button
                                size="small"
                                sx={{ ml: 2 }}
                                onClick={() =>
                                    setSelectedCustomerId(null)
                                }
                            >
                                Clear Customer Filter
                            </Button>
                        )
                    }
                </Box>

                <TextField

                    fullWidth

                    placeholder="Search Sales No / Customer / Invoice"

                    value={search}

                    onChange={(e) =>
                        setSearch(e.target.value)
                    }

                    sx={{ mb: 2 }}

                />

                <Box

                    sx={{

                        height: 600,

                        width: "100%"

                    }}

                >

                    <DataGrid

                        rows={filteredRows}

                        columns={columns}

                        loading={loading}

                        getRowId={(row) =>
                            row.sales_id
                        }

                        pageSizeOptions={[10, 20, 50]}

                        initialState={{

                            pagination: {

                                paginationModel: {

                                    pageSize: 10

                                }

                            }

                        }}

                        disableRowSelectionOnClick

                    />

                </Box>

            </Paper>

        </MainLayout>

    );

}