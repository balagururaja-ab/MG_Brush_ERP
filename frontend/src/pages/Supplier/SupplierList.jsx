import {
    Box,
    Button,
    IconButton,
    Paper,
    TextField,
    Typography
} from "@mui/material";

import {
    DataGrid
} from "@mui/x-data-grid";

import {
    Edit,
    Delete,
    Add
} from "@mui/icons-material";

import {
    useEffect,
    useState
} from "react";

import AppHeader from "../../components/AppHeader";

import {
    getSuppliers,
    deleteSupplier
} from "../../api/supplierApi";

import SupplierForm from "./SupplierForm";

export default function SupplierList() {

    const [suppliers, setSuppliers] =
        useState([]);

    const [filteredSuppliers, setFilteredSuppliers] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [search, setSearch] =
        useState("");

    const [openForm, setOpenForm] =
        useState(false);

    const [selectedSupplier, setSelectedSupplier] =
        useState(null);

    //---------------------------------------------------------
    // Load Suppliers
    //---------------------------------------------------------

    const loadSuppliers = async () => {

        try {

            setLoading(true);

            const data =
                await getSuppliers();

            setSuppliers(data);

            setFilteredSuppliers(data);

        }
        catch (err) {

            console.error(err);

            alert("Unable to load suppliers.");

        }
        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadSuppliers();

    }, []);

    //---------------------------------------------------------
    // Search
    //---------------------------------------------------------

    useEffect(() => {

        const value =
            search.toLowerCase();

        setFilteredSuppliers(

            suppliers.filter(

                (supplier) =>

                    supplier.supplier_code
                        ?.toLowerCase()
                        .includes(value)

                    ||

                    supplier.supplier_name
                        ?.toLowerCase()
                        .includes(value)

                    ||

                    supplier.mobile
                        ?.toLowerCase()
                        .includes(value)

                    ||

                    supplier.gstin
                        ?.toLowerCase()
                        .includes(value)

                    ||

                    supplier.contact_person
                        ?.toLowerCase()
                        .includes(value)

            )

        );

    }, [search, suppliers]);

    //---------------------------------------------------------
    // Add Supplier
    //---------------------------------------------------------

    const handleAdd = () => {

        setSelectedSupplier(null);

        setOpenForm(true);

    };

    //---------------------------------------------------------
    // Edit Supplier
    //---------------------------------------------------------

    const handleEdit = (supplier) => {

        setSelectedSupplier(supplier);

        setOpenForm(true);

    };

    //---------------------------------------------------------
    // Delete Supplier
    //---------------------------------------------------------

    const handleDelete = async (supplierId) => {

        if (
            !window.confirm(
                "Delete this supplier?"
            )
        ) {
            return;
        }

        try {

            await deleteSupplier(
                supplierId
            );

            loadSuppliers();

        }
        catch (err) {

            console.error(err);

            alert(
                "Unable to delete supplier."
            );

        }

    };

    //---------------------------------------------------------
    // DataGrid Columns
    //---------------------------------------------------------

    const columns = [

        {
            field: "supplier_code",
            headerName: "Code",
            width: 120
        },

        {
            field: "supplier_name",
            headerName: "Supplier Name",
            flex: 1
        },

        {
            field: "contact_person",
            headerName: "Contact",
            width: 170
        },

        {
            field: "mobile",
            headerName: "Mobile",
            width: 150
        },

        {
            field: "gstin",
            headerName: "GSTIN",
            width: 180
        },

        {
            field: "city",
            headerName: "City",
            width: 140
        },

        {
            field: "credit_days",
            headerName: "Credit Days",
            width: 130
        },

        {
            field: "actions",
            headerName: "Actions",
            width: 130,
            sortable: false,
            renderCell: (params) => (

                <>

                    <IconButton
                        color="primary"
                        onClick={() =>
                            handleEdit(params.row)
                        }
                    >

                        <Edit />

                    </IconButton>

                    <IconButton
                        color="error"
                        onClick={() =>
                            handleDelete(
                                params.row.supplier_id
                            )
                        }
                    >

                        <Delete />

                    </IconButton>

                </>

            )
        }

    ];
        return (

        <>

            <AppHeader />

            <Box sx={{ p: 3 }}>

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
                        Supplier Master
                    </Typography>

                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleAdd}
                    >
                        Add Supplier
                    </Button>

                </Box>

                <TextField
                    fullWidth
                    label="Search Supplier"
                    placeholder="Code / Name / Contact / Mobile / GSTIN"
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    sx={{ mb: 3 }}
                />

                <DataGrid

                    rows={filteredSuppliers}

                    columns={columns}

                    loading={loading}

                    getRowId={(row) =>
                        row.supplier_id
                    }

                    autoHeight

                    disableRowSelectionOnClick

                    pageSizeOptions={[
                        10,
                        20,
                        50
                    ]}

                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10
                            }
                        }
                    }}

                />

            </Paper>

            <SupplierForm

                open={openForm}

                onClose={() =>
                    setOpenForm(false)
                }

                supplier={selectedSupplier}

                refresh={loadSuppliers}

            />

                </Box>

    </>

    );

}