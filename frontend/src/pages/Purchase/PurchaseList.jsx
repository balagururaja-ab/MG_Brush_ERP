import { useEffect, useState } from "react";

import {
    Paper,
    Typography,
    Button,
    Box,
    TextField,
    IconButton
} from "@mui/material";

import {
    DataGrid
} from "@mui/x-data-grid";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

import {
    useNavigate
} from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";

import {
    getPurchases,
    deletePurchase
} from "../../api/purchaseApi";

export default function PurchaseList() {

    const navigate = useNavigate();

    const [rows, setRows] = useState([]);

    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");

    //---------------------------------------------------------
    // Load Purchases
    //---------------------------------------------------------

    useEffect(() => {

        loadPurchases();

    }, []);

    const loadPurchases = async () => {

        try {

            setLoading(true);

            const data = await getPurchases();

            setRows(data);

        }
        catch (err) {

            console.error(err);

        }
        finally {

            setLoading(false);

        }

    };

    //---------------------------------------------------------
    // Delete Purchase
    //---------------------------------------------------------

    const handleDelete = async (purchaseId) => {

        if (!window.confirm(
            "Delete this purchase?"
        )) {

            return;

        }

        try {

            await deletePurchase(
                purchaseId
            );

            loadPurchases();

        }
        catch (err) {

            console.error(err);

            alert(
                err.response?.data?.detail ||
                "Unable to delete purchase."
            );

        }

    };
        //---------------------------------------------------------
    // Filter Data
    //---------------------------------------------------------

    const filteredRows = rows.filter((row) =>

        row.purchase_no
            ?.toLowerCase()
            .includes(search.toLowerCase())

        ||

        row.supplier_name
            ?.toLowerCase()
            .includes(search.toLowerCase())

        ||

        row.invoice_no
            ?.toLowerCase()
            .includes(search.toLowerCase())

    );

    //---------------------------------------------------------
    // Grid Columns
    //---------------------------------------------------------

    const columns = [

        {
            field: "purchase_no",
            headerName: "Purchase No",
            width: 150
        },

        {
            field: "purchase_date",
            headerName: "Purchase Date",
            width: 140
        },

        {
            field: "supplier_name",
            headerName: "Supplier",
            flex: 1,
            minWidth: 220
        },

        {
            field: "invoice_no",
            headerName: "Invoice No",
            width: 150
        },

        {
            field: "grand_total",
            headerName: "Grand Total",
            width: 140,
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
                                `/purchase/${params.row.purchase_id}`
                            )
                        }
                    >
                        <VisibilityIcon />
                    </IconButton>

                    <IconButton
                        color="warning"
                        onClick={() =>
                            navigate(
                                `/purchase/edit/${params.row.purchase_id}`
                            )
                        }
                    >
                        <EditIcon />
                    </IconButton>

                    <IconButton
                        color="error"
                        onClick={() =>
                            handleDelete(
                                params.row.purchase_id
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
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={3}
                >

                    <Typography
                        variant="h5"
                        fontWeight="bold"
                    >
                        Purchase List
                    </Typography>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() =>
                            navigate("/purchase/new")
                        }
                    >
                        New Purchase
                    </Button>

                </Box>

                <TextField

                    fullWidth

                    placeholder="Search Purchase No / Supplier / Invoice"

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
                            row.purchase_id
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