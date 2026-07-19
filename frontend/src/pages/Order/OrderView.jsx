import { useEffect, useState } from "react";

import {

    Box,

    Paper,

    Typography,

    Button,

    Grid,

    Divider,

    Chip

} from "@mui/material";

import {

    ArrowBack,

    Edit,

    ReceiptLong

} from "@mui/icons-material";

import {

    useNavigate,

    useParams

} from "react-router-dom";

import {

    getOrder

} from "../../api/orderApi";

export default function OrderView() {

    const navigate = useNavigate();

    const { id } = useParams();

    const [loading, setLoading] = useState(false);

    const [order, setOrder] = useState({});

    const [items, setItems] = useState([]);

    //---------------------------------------------------------
    // Load Order
    //---------------------------------------------------------

    const loadOrder = async () => {

        try {

            setLoading(true);

            const data = await getOrder(id);

            console.log(data);

            setOrder(data);

            setItems(data.items || []);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }
    };

    //---------------------------------------------------------
    // Initial Load
    //---------------------------------------------------------

    useEffect(() => {

        loadOrder();

    }, []);

    //---------------------------------------------------------
    // Grand Total
    //---------------------------------------------------------

    const grandTotal = items.reduce(

        (

            total,

            item

        ) =>

            total +

            Number(

                item.amount || 0

            ),

        0

    );
        //---------------------------------------------------------
    // UI
    //---------------------------------------------------------

    return (

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

                        Customer Order

                    </Typography>

                    <Box>

                        <Button

                            variant="outlined"

                            startIcon={<ArrowBack />}

                            sx={{ mr: 2 }}

                            onClick={() =>

                                navigate("/orders")

                            }

                        >

                            Back

                        </Button>

                        <Button

                            variant="contained"

                            startIcon={<Edit />}

                            sx={{ mr: 2 }}

                            onClick={() =>

                                navigate(

                                    `/orders/edit/${id}`

                                )

                            }

                        >

                            Edit

                        </Button>

                        <Button

                            variant="contained"

                            color="success"

                            startIcon={<ReceiptLong />}

                            disabled={

                                order.invoice_generated

                            }

                        >

                            {

                                order.invoice_generated

                                    ? "Invoice Generated"

                                    : "Generate Invoice"

                            }

                        </Button>

                    </Box>

                </Box>

                <Divider sx={{ mb: 3 }} />

                <Grid

                    container

                    spacing={3}

                >

                    <Grid item xs={12} md={6}>

                        <Typography

                            variant="subtitle2"

                            color="text.secondary"

                        >

                            Order No

                        </Typography>

                        <Typography>

                            {order.order_no}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={6}>

                        <Typography

                            variant="subtitle2"

                            color="text.secondary"

                        >

                            Customer

                        </Typography>

                        <Typography>

                            {order.customer_name}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={4}>

                        <Typography

                            variant="subtitle2"

                            color="text.secondary"

                        >

                            Order Date

                        </Typography>

                        <Typography>

                            {order.order_date}

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={4}>

                        <Typography

                            variant="subtitle2"

                            color="text.secondary"

                        >

                            Expected Delivery

                        </Typography>

                        <Typography>

                            {

                                order.expected_delivery ||

                                "-"

                            }

                        </Typography>

                    </Grid>

                    <Grid item xs={12} md={4}>

                        <Typography

                            variant="subtitle2"

                            color="text.secondary"

                            gutterBottom

                        >

                            Status

                        </Typography>

                        <Chip

                            label={

                                order.status

                            }

                            color={

                                order.status === "CONFIRMED"

                                    ? "primary"

                                    : order.status === "INVOICED"

                                    ? "success"

                                    : order.status === "CANCELLED"

                                    ? "error"

                                    : "warning"

                            }

                        />

                    </Grid>

                    <Grid item xs={12}>

                        <Typography

                            variant="subtitle2"

                            color="text.secondary"

                        >

                            Remarks

                        </Typography>

                        <Typography>

                            {

                                order.remarks ||

                                "-"

                            }

                        </Typography>

                    </Grid>

                </Grid>

                <Divider sx={{ my: 4 }} />

                <Typography

                    variant="h6"

                    gutterBottom

                >

                    Order Items

                </Typography>
                <Typography

    variant="h6"

    gutterBottom

>

    Order Items

</Typography>
                <Paper variant="outlined">

                    <table

                        width="100%"

                        style={{

                            borderCollapse: "collapse"

                        }}

                    >

                        <thead>

                            <tr>

                                <th style={{ padding: 10 }}>#</th>

                                <th align="left">
                                    Brand
                                </th>

                                <th align="left">
                                    Brush Size
                                </th>

                                <th>

                                    Qty

                                </th>

                                <th>

                                    Rate

                                </th>

                                <th>

                                    Amount

                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                items.map(

                                    (

                                        item,

                                        index

                                    ) => (

                                        <tr

                                            key={index}

                                        >

                                            <td

                                                style={{

                                                    padding: 10

                                                }}

                                            >

                                                {

                                                    index + 1

                                                }

                                            </td>

                                            <td>
                                                {item.brand_name}
                                            </td>

                                            <td>
                                                {item.size_name}
                                            </td>

                                            <td

                                                align="center"

                                            >

                                                {

                                                    Number(

                                                        item.quantity

                                                    ).toFixed(2)

                                                }

                                            </td>

                                            <td

                                                align="right"

                                            >

                                                ₹

                                                {

                                                    Number(

                                                        item.rate

                                                    ).toFixed(2)

                                                }

                                            </td>

                                            <td

                                                align="right"

                                            >

                                                ₹

                                                {

                                                    Number(

                                                        item.amount

                                                    ).toFixed(2)

                                                }

                                            </td>

                                        </tr>

                                    )

                                )

                            }

                        </tbody>

                    </table>

                </Paper>

                <Divider sx={{ my: 3 }} />

                <Box

                    display="flex"

                    justifyContent="flex-end"

                >

                    <Typography

                        variant="h5"

                        fontWeight="bold"

                    >

                        Grand Total :

                        ₹ {grandTotal.toFixed(2)}

                    </Typography>

                </Box>

            </Paper>

        </Box>

    );

}