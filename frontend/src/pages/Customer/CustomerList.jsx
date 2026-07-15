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

import {
    useNavigate
} from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";

import {
    getCustomers,
    deleteCustomer
} from "../../api/customerApi";

export default function CustomerList() {

    const navigate = useNavigate();

    const [rows, setRows] = useState([]);

    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");

    //---------------------------------------------------------
    // Load Customers
    //---------------------------------------------------------

    useEffect(() => {

        loadCustomers();

    }, []);

    const loadCustomers = async () => {

        try {

            setLoading(true);

            const data = await getCustomers();

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
    // Delete Customer
    //---------------------------------------------------------

    const handleDelete = async (customerId) => {

        if (!window.confirm(
            "Delete this customer?"
        )) {

            return;

        }

        try {

            await deleteCustomer(customerId);

            loadCustomers();

        }
        catch (err) {

            console.error(err);

            alert(
                err.response?.data?.detail ||
                "Unable to delete customer."
            );

        }

    };

    //---------------------------------------------------------
    // Filter
    //---------------------------------------------------------

    const filteredRows = rows.filter((row) =>

        row.customer_code
            ?.toLowerCase()
            .includes(search.toLowerCase())

        ||

        row.customer_name
            ?.toLowerCase()
            .includes(search.toLowerCase())

        ||

        row.mobile
            ?.toLowerCase()
            .includes(search.toLowerCase())

        ||

        row.city
            ?.toLowerCase()
            .includes(search.toLowerCase())

    );
        //---------------------------------------------------------
    // Grid Columns
    //---------------------------------------------------------

    const columns = [

        {
            field: "customer_code",
            headerName: "Code",
            width: 130
        },

        {
            field: "customer_name",
            headerName: "Customer Name",
            flex: 1,
            minWidth: 250
        },

        {
            field: "contact_person",
            headerName: "Contact Person",
            width: 180
        },

        {
            field: "mobile",
            headerName: "Mobile",
            width: 140
        },

        {
            field: "city",
            headerName: "City",
            width: 150
        },

        {
            field: "credit_limit",
            headerName: "Credit Limit",
            width: 140,
            type: "number"
        },

        {
            field: "credit_days",
            headerName: "Credit Days",
            width: 120,
            type: "number"
        },

        {
            field: "is_active",
            headerName: "Status",
            width: 120,

            renderCell: (params) =>

                params.value
                    ? "Active"
                    : "Inactive"

        },

        {
            field: "actions",

            headerName: "Actions",

            width: 150,

            sortable: false,

            renderCell: (params) => (

                <>

                    <IconButton

                        color="warning"

                        onClick={() =>
                            navigate(
                                `/customer/edit/${params.row.customer_id}`
                            )
                        }

                    >

                        <EditIcon />

                    </IconButton>

                    <IconButton

                        color="error"

                        onClick={() =>
                            handleDelete(
                                params.row.customer_id
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
                        Customer List
                    </Typography>

                    <Button

                        variant="contained"

                        startIcon={<AddIcon />}

                        onClick={() =>
                            navigate("/customer/new")
                        }

                    >

                        New Customer

                    </Button>

                </Box>

                <TextField

                    fullWidth

                    placeholder="Search Customer Code / Name / Mobile / City"

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
                            row.customer_id
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