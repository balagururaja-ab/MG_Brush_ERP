import { useEffect, useMemo, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    Grid,
    MenuItem,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";

import MainLayout from "../../layouts/MainLayout";

import { getCustomers } from "../../api/customerApi";
import { getSuppliers } from "../../api/supplierApi";
import {
    getReportsOverview,
    getCustomerSalesReport,
    getSupplierPurchaseReport,
    getMandatoryReports
} from "../../api/reportApi";

const today = new Date().toISOString().slice(0, 10);

function csvEscape(value) {

    const text = String(value ?? "");

    if (text.includes(",") || text.includes("\n") || text.includes("\"")) {
        return `"${text.replace(/\"/g, "\"\"")}"`;
    }

    return text;

}

function downloadCsv(fileName, headers, rows) {

    const headerLine = headers.map((header) => csvEscape(header.label)).join(",");

    const bodyLines = rows.map(
        (row) => headers.map((header) => csvEscape(row[header.key])).join(",")
    );

    const csvContent = [headerLine, ...bodyLines].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.setAttribute("download", fileName);
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    URL.revokeObjectURL(url);

}

function formatAmount(value) {
    const number = Number(value || 0);

    return number.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

export default function ReportsDashboard() {

    const [loading, setLoading] = useState(false);

    const [overview, setOverview] = useState({
        total_sales: 0,
        sales_value: 0,
        sales_pending: 0,
        total_purchases: 0,
        purchase_value: 0,
        low_stock_count: 0
    });

    const [mandatory, setMandatory] = useState({
        pending_customers: [],
        low_stock: []
    });

    const [customers, setCustomers] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    const [filters, setFilters] = useState({
        customer_id: "",
        supplier_id: "",
        from_date: "",
        to_date: today
    });

    const [customerSales, setCustomerSales] = useState([]);
    const [supplierPurchases, setSupplierPurchases] = useState([]);

    const [errorMessage, setErrorMessage] = useState("");

    const summaryCards = useMemo(
        () => [
            {
                title: "Total Sales",
                value: overview.total_sales || 0
            },
            {
                title: "Sales Value",
                value: formatAmount(overview.sales_value)
            },
            {
                title: "Sales Pending",
                value: formatAmount(overview.sales_pending)
            },
            {
                title: "Total Purchases",
                value: overview.total_purchases || 0
            },
            {
                title: "Purchase Value",
                value: formatAmount(overview.purchase_value)
            },
            {
                title: "Low Stock Items",
                value: overview.low_stock_count
            }
        ],
        [overview]
    );

    const handleFilterChange = (field, value) => {

        setFilters((prev) => ({
            ...prev,
            [field]: value
        }));

    };

    const buildDateParams = () => {

        const params = {};

        if (filters.from_date) {
            params.from_date = filters.from_date;
        }

        if (filters.to_date) {
            params.to_date = filters.to_date;
        }

        return params;

    };

    const loadBaseData = async () => {

        setLoading(true);
        setErrorMessage("");

        try {
            const [
                overviewData,
                mandatoryData,
                customerList,
                supplierList
            ] = await Promise.all([
                getReportsOverview(),
                getMandatoryReports(),
                getCustomers(),
                getSuppliers()
            ]);

            setOverview(overviewData || {});
            setMandatory(mandatoryData || {
                pending_customers: [],
                low_stock: []
            });
            setCustomers(customerList || []);
            setSuppliers(supplierList || []);
        }
        catch (error) {
            console.error(error);
            setErrorMessage("Failed to load report data.");
        }
        finally {
            setLoading(false);
        }

    };

    const loadCustomerSales = async () => {

        try {
            const params = {
                ...buildDateParams()
            };

            if (filters.customer_id) {
                params.customer_id = Number(filters.customer_id);
            }

            const data = await getCustomerSalesReport(params);
            setCustomerSales(data || []);
        }
        catch (error) {
            console.error(error);
            setErrorMessage("Failed to load customer sales report.");
        }

    };

    const loadSupplierPurchases = async () => {

        try {
            const params = {
                ...buildDateParams()
            };

            if (filters.supplier_id) {
                params.supplier_id = Number(filters.supplier_id);
            }

            const data = await getSupplierPurchaseReport(params);
            setSupplierPurchases(data || []);
        }
        catch (error) {
            console.error(error);
            setErrorMessage("Failed to load supplier purchase report.");
        }

    };

    const clearFilters = () => {

        setFilters({
            customer_id: "",
            supplier_id: "",
            from_date: "",
            to_date: today
        });

    };

    const applyAllFilters = async () => {

        setLoading(true);

        try {
            await Promise.all([
                loadCustomerSales(),
                loadSupplierPurchases()
            ]);
        }
        finally {
            setLoading(false);
        }

    };

    const exportCustomerSales = () => {

        const rows = customerSales.map((row) => ({
            sales_date: row.sales_date,
            sales_no: row.sales_no,
            customer_name: row.customer_name,
            grand_total: row.grand_total,
            paid_amount: row.paid_amount,
            pending_amount: row.pending_amount,
            payment_status: row.payment_status
        }));

        downloadCsv(
            "customer_sales_history.csv",
            [
                { key: "sales_date", label: "Date" },
                { key: "sales_no", label: "Sales No" },
                { key: "customer_name", label: "Customer" },
                { key: "grand_total", label: "Grand Total" },
                { key: "paid_amount", label: "Paid" },
                { key: "pending_amount", label: "Pending" },
                { key: "payment_status", label: "Status" }
            ],
            rows
        );

    };

    const exportSupplierPurchases = () => {

        const rows = supplierPurchases.map((row) => ({
            purchase_date: row.purchase_date,
            purchase_no: row.purchase_no,
            supplier_name: row.supplier_name,
            grand_total: row.grand_total,
            payment_status: row.payment_status
        }));

        downloadCsv(
            "supplier_purchase_history.csv",
            [
                { key: "purchase_date", label: "Date" },
                { key: "purchase_no", label: "Purchase No" },
                { key: "supplier_name", label: "Supplier" },
                { key: "grand_total", label: "Grand Total" },
                { key: "payment_status", label: "Status" }
            ],
            rows
        );

    };

    const exportPendingCustomers = () => {

        const rows = (mandatory.pending_customers || []).map((row) => ({
            customer_name: row.customer_name,
            total_pending: row.total_pending
        }));

        downloadCsv(
            "pending_customers_summary.csv",
            [
                { key: "customer_name", label: "Customer" },
                { key: "total_pending", label: "Pending" }
            ],
            rows
        );

    };

    const exportLowStock = () => {

        const rows = (mandatory.low_stock || []).map((row) => ({
            item_code: row.item_code,
            item_name: row.item_name,
            current_qty: row.current_qty,
            reorder_level: row.reorder_level
        }));

        downloadCsv(
            "low_stock_mandatory.csv",
            [
                { key: "item_code", label: "Item Code" },
                { key: "item_name", label: "Item Name" },
                { key: "current_qty", label: "Current Qty" },
                { key: "reorder_level", label: "Reorder Level" }
            ],
            rows
        );

    };

    const refreshAll = async () => {
        await loadBaseData();
        await Promise.all([
            loadCustomerSales(),
            loadSupplierPurchases()
        ]);
    };

    useEffect(() => {
        refreshAll();
    }, []);

    return (
        <MainLayout>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={3}
                >
                    <Box>
                        <Typography variant="h5" fontWeight="bold">
                            Reports Dashboard
                        </Typography>
                        <Typography color="text.secondary">
                            Customer wise history and mandatory management reports
                        </Typography>
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<RefreshIcon />}
                        onClick={refreshAll}
                        disabled={loading}
                    >
                        Refresh
                    </Button>
                </Stack>

                {errorMessage && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {errorMessage}
                    </Alert>
                )}

                <Grid container spacing={2} mb={3}>
                    {summaryCards.map((card) => (
                        <Grid key={card.title} size={{ xs: 12, sm: 6, md: 3 }}>
                            <Card>
                                <CardContent>
                                    <Typography color="text.secondary" variant="body2">
                                        {card.title}
                                    </Typography>
                                    <Typography variant="h6" fontWeight="bold">
                                        {card.value}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2} mb={3}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                            fullWidth
                            label="From Date"
                            type="date"
                            value={filters.from_date}
                            onChange={(event) =>
                                handleFilterChange("from_date", event.target.value)
                            }
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                            fullWidth
                            label="To Date"
                            type="date"
                            value={filters.to_date}
                            onChange={(event) =>
                                handleFilterChange("to_date", event.target.value)
                            }
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                            fullWidth
                            select
                            label="Customer"
                            value={filters.customer_id}
                            onChange={(event) =>
                                handleFilterChange("customer_id", event.target.value)
                            }
                        >
                            <MenuItem value="">All Customers</MenuItem>
                            {customers.map((customer) => (
                                <MenuItem
                                    key={customer.customer_id}
                                    value={customer.customer_id}
                                >
                                    {customer.customer_name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                            fullWidth
                            select
                            label="Supplier"
                            value={filters.supplier_id}
                            onChange={(event) =>
                                handleFilterChange("supplier_id", event.target.value)
                            }
                        >
                            <MenuItem value="">All Suppliers</MenuItem>
                            {suppliers.map((supplier) => (
                                <MenuItem
                                    key={supplier.supplier_id}
                                    value={supplier.supplier_id}
                                >
                                    {supplier.supplier_name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>

                <Stack direction="row" spacing={2} mb={3} flexWrap="wrap" useFlexGap>
                    <Button
                        variant="outlined"
                        onClick={loadCustomerSales}
                        disabled={loading}
                    >
                        Load Customer Sales
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={loadSupplierPurchases}
                        disabled={loading}
                    >
                        Load Supplier Purchases
                    </Button>

                    <Button
                        variant="contained"
                        onClick={applyAllFilters}
                        disabled={loading}
                    >
                        Apply All Filters
                    </Button>

                    <Button
                        variant="text"
                        onClick={clearFilters}
                        disabled={loading}
                    >
                        Clear Filters
                    </Button>
                </Stack>

                {loading ? (
                    <Box display="flex" justifyContent="center" py={5}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={1}
                        >
                            <Typography variant="h6" fontWeight="bold">
                                Customer Wise Sales History
                            </Typography>

                            <Button
                                size="small"
                                startIcon={<DownloadIcon />}
                                onClick={exportCustomerSales}
                                disabled={customerSales.length === 0}
                            >
                                Export CSV
                            </Button>
                        </Stack>

                        <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Sales No</TableCell>
                                        <TableCell>Customer</TableCell>
                                        <TableCell align="right">Grand Total</TableCell>
                                        <TableCell align="right">Paid</TableCell>
                                        <TableCell align="right">Pending</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {customerSales.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center">
                                                No records
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {customerSales.map((row) => (
                                        <TableRow key={row.sales_id}>
                                            <TableCell>{row.sales_date}</TableCell>
                                            <TableCell>{row.sales_no}</TableCell>
                                            <TableCell>{row.customer_name}</TableCell>
                                            <TableCell align="right">
                                                {formatAmount(row.grand_total)}
                                            </TableCell>
                                            <TableCell align="right">
                                                {formatAmount(row.paid_amount)}
                                            </TableCell>
                                            <TableCell align="right">
                                                {formatAmount(row.pending_amount)}
                                            </TableCell>
                                            <TableCell>{row.payment_status}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={1}
                        >
                            <Typography variant="h6" fontWeight="bold">
                                Supplier Wise Purchase History
                            </Typography>

                            <Button
                                size="small"
                                startIcon={<DownloadIcon />}
                                onClick={exportSupplierPurchases}
                                disabled={supplierPurchases.length === 0}
                            >
                                Export CSV
                            </Button>
                        </Stack>

                        <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Purchase No</TableCell>
                                        <TableCell>Supplier</TableCell>
                                        <TableCell align="right">Grand Total</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {supplierPurchases.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">
                                                No records
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {supplierPurchases.map((row) => (
                                        <TableRow key={row.purchase_id}>
                                            <TableCell>{row.purchase_date}</TableCell>
                                            <TableCell>{row.purchase_no}</TableCell>
                                            <TableCell>{row.supplier_name}</TableCell>
                                            <TableCell align="right">
                                                {formatAmount(row.grand_total)}
                                            </TableCell>
                                            <TableCell>{row.payment_status}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    mb={1}
                                >
                                    <Typography variant="h6" fontWeight="bold">
                                        Pending Collection Summary
                                    </Typography>

                                    <Button
                                        size="small"
                                        startIcon={<DownloadIcon />}
                                        onClick={exportPendingCustomers}
                                        disabled={(mandatory.pending_customers || []).length === 0}
                                    >
                                        Export CSV
                                    </Button>
                                </Stack>

                                <TableContainer component={Paper} variant="outlined">
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Customer</TableCell>
                                                <TableCell align="right">Pending</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {(mandatory.pending_customers || []).length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={2} align="center">
                                                        No pending customers
                                                    </TableCell>
                                                </TableRow>
                                            )}

                                            {(mandatory.pending_customers || []).map((row) => (
                                                <TableRow key={row.customer_id}>
                                                    <TableCell>{row.customer_name}</TableCell>
                                                    <TableCell align="right">
                                                        {formatAmount(row.total_pending)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    mb={1}
                                >
                                    <Typography variant="h6" fontWeight="bold">
                                        Low Stock (Mandatory)
                                    </Typography>

                                    <Button
                                        size="small"
                                        startIcon={<DownloadIcon />}
                                        onClick={exportLowStock}
                                        disabled={(mandatory.low_stock || []).length === 0}
                                    >
                                        Export CSV
                                    </Button>
                                </Stack>

                                <TableContainer component={Paper} variant="outlined">
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Item</TableCell>
                                                <TableCell align="right">Current Qty</TableCell>
                                                <TableCell align="right">Reorder</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {(mandatory.low_stock || []).length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={3} align="center">
                                                        No low stock items
                                                    </TableCell>
                                                </TableRow>
                                            )}

                                            {(mandatory.low_stock || []).map((row) => (
                                                <TableRow key={row.item_id}>
                                                    <TableCell>
                                                        {row.item_code} - {row.item_name}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {formatAmount(row.current_qty)}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {formatAmount(row.reorder_level)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid>
                    </>
                )}
            </Paper>
        </MainLayout>
    );
}
