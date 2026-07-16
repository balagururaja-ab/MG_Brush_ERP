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
    getSales,
    deleteSales
} from "../../api/salesApi";

export default function SalesList() {

    const navigate = useNavigate();

    const [rows, setRows] = useState([]);

    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");

    //---------------------------------------------------------
    // Load Sales
    //---------------------------------------------------------

    useEffect(() => {

        loadSales();

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

    const filteredRows = rows.filter((row) =>

        row.sales_no
            ?.toLowerCase()
            .includes(search.toLowerCase())

        ||

        row.customer_name
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

                    <Button

                        variant="contained"

                        startIcon={<AddIcon />}

                        onClick={() =>
                            navigate("/sales/new")
                        }

                    >

                        New Sales

                    </Button>

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