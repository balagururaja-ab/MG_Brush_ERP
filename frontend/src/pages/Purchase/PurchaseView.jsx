import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
    Paper,
    Typography,
    Grid,
    Box,
    Button,
    Divider,
    CircularProgress
} from "@mui/material";

import {
    DataGrid
} from "@mui/x-data-grid";

import MainLayout from "../../layouts/MainLayout";

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
                            {purchase.supplier_name}
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography fontWeight="bold">
                            Invoice No
                        </Typography>

                        <Typography>
                            {purchase.invoice_no}
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

            </Paper>

        </MainLayout>

    );

}