import { useEffect, useState } from "react";

import {

    Box,

    Button,

    Paper,

    TextField,

    Typography,

    Chip

} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import {

    Add,

    Visibility,

    Edit,

    Delete

} from "@mui/icons-material";

import {

    useNavigate

} from "react-router-dom";

import {

    getOrders,

    deleteOrder

} from "../../api/orderApi";

import AppHeader from "../../components/AppHeader";

export default function OrderList() {

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);

    const [filteredOrders, setFilteredOrders] = useState([]);

    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");

    //---------------------------------------------------------
    // Load Orders
    //---------------------------------------------------------

    const loadOrders = async () => {

        try {

            setLoading(true);

            const data = await getOrders();

            setOrders(data);

            setFilteredOrders(data);

        }

        catch (err) {

            console.error(err);

            alert("Unable to load orders.");

        }

        finally {

            setLoading(false);

        }

    };

    //---------------------------------------------------------
    // Initial Load
    //---------------------------------------------------------

    useEffect(() => {

        loadOrders();

    }, []);

    //---------------------------------------------------------
    // Search Filter
    //---------------------------------------------------------

    useEffect(() => {

        const value = search.toLowerCase();

        setFilteredOrders(

            orders.filter(

                (order) =>

                    order.order_no

                        ?.toLowerCase()

                        .includes(value)

                    ||

                    order.customer_name

                        ?.toLowerCase()

                        .includes(value)

                    ||

                    order.status

                        ?.toLowerCase()

                        .includes(value)

            )

        );

    }, [search, orders]);

    //---------------------------------------------------------
    // Delete Order
    //---------------------------------------------------------

    const handleDelete = async (

        orderId

    ) => {

        if (

            !window.confirm(

                "Delete this order?"

            )

        ) {

            return;

        }

        try {

            await deleteOrder(

                orderId

            );

            loadOrders();

        }

        catch (err) {

            console.error(err);

            alert(

                "Unable to delete order."

            );

        }

    };
        //---------------------------------------------------------
    // DataGrid Columns
    //---------------------------------------------------------

    const columns = [

        {
            field: "order_no",
            headerName: "Order No",
            width: 140
        },

        {
            field: "order_date",
            headerName: "Order Date",
            width: 140
        },

        {
            field: "customer_name",
            headerName: "Customer",
            flex: 1
        },

        {
            field: "expected_delivery",
            headerName: "Delivery",
            width: 140
        },

        {
            field: "status",
            headerName: "Status",
            width: 150,

            renderCell: (params) => {

                const status = params.value;

                let color = "default";

                if (status === "DRAFT") {

                    color = "warning";

                }

                else if (status === "CONFIRMED") {

                    color = "primary";

                }

                else if (status === "INVOICED") {

                    color = "success";

                }

                else if (status === "CANCELLED") {

                    color = "error";

                }

                return (

                    <Chip

                        label={status}

                        color={color}

                        size="small"

                    />

                );

            }

        },

        {
            field: "actions",

            headerName: "Actions",

            width: 240,

            sortable: false,

            renderCell: (params) => (

                <>

                    <Button

                        size="small"

                        startIcon={<Visibility />}

                        onClick={() =>

                            navigate(

                                `/orders/${params.row.order_id}`

                            )

                        }

                    >

                        View

                    </Button>

                    <Button

                        size="small"

                        startIcon={<Edit />}

                        onClick={() =>

                            navigate(

                                `/orders/edit/${params.row.order_id}`

                            )

                        }

                    >

                        Edit

                    </Button>

                    <Button

                        color="error"

                        size="small"

                        startIcon={<Delete />}

                        onClick={() =>

                            handleDelete(

                                params.row.order_id

                            )

                        }

                    >

                        Delete

                    </Button>

                </>

            )

        }

    ];
        //---------------------------------------------------------
    // UI
    //---------------------------------------------------------

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

                        Customer Orders

                    </Typography>

                    <Button

                        variant="contained"

                        startIcon={<Add />}

                        onClick={() =>

                            navigate("/orders/new")

                        }

                    >

                        New Order

                    </Button>

                </Box>

                <TextField

                    fullWidth

                    label="Search Orders"

                    placeholder="Order No / Customer / Status"

                    value={search}

                    onChange={(e) =>

                        setSearch(

                            e.target.value

                        )

                    }

                    sx={{ mb: 3 }}

                />

                <DataGrid

                    rows={filteredOrders}

                    columns={columns}

                    loading={loading}

                    autoHeight

                    disableRowSelectionOnClick

                    getRowId={(row) =>

                        row.order_id

                    }

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

        </Box>
    </>

    );

}