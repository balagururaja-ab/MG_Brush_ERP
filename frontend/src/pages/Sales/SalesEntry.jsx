import { useEffect, useState } from "react";

import {

    Paper,
    Typography,
    Divider,
    Button,
    Box

} from "@mui/material";

import {

    useNavigate,
    useParams

} from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";

import SalesHeader from "./SalesHeader";
import SalesItemGrid from "./SalesItemGrid";
import SalesSummary from "./SalesSummary";

import {

    createSales,
    updateSales,
    getSale

} from "../../api/salesApi";

export default function SalesEntry() {

    const navigate = useNavigate();

    const { id } = useParams();

    const isEdit = !!id;

    const [sales, setSales] = useState({

        sales_date: new Date()

            .toISOString()

            .substring(0, 10),

        customer_id: "",

        invoice_no: "",

        invoice_date: new Date()

            .toISOString()

            .substring(0, 10),

        is_gst: false,

        gst_percent: 0,

        paid_amount: 0,

        pending_amount: 0,

        payment_status: "PENDING",

        remarks: ""

    });

    const [items, setItems] = useState([]);

    //---------------------------------------------------------
    // Load Sales
    //---------------------------------------------------------

    useEffect(() => {

        if (isEdit) {

            loadSales();

        }

    }, []);

    const loadSales = async () => {

        try {

            const data = await getSale(id);

            setSales({

                sales_date: data.sales_date,

                customer_id: data.customer_id,

                invoice_no: data.invoice_no,

                invoice_date: data.invoice_date,

                is_gst: data.is_gst,

                gst_percent: data.gst_percent,

                paid_amount: data.paid_amount,

                pending_amount: data.pending_amount,

                payment_status: data.payment_status,

                remarks: data.remarks

            });

            setItems(data.items);

        }
        catch (err) {

            console.error(err);

            alert("Unable to load sales.");

        }

    };

    //---------------------------------------------------------
    // Header Change
    //---------------------------------------------------------

    const handleChange = (e) => {

        const {

            name,

            value,

            type

        } = e.target;

        setSales(prev => ({

            ...prev,

            [name]:
                name === "is_gst"
                    ? value === "true"
                    : type === "number"
                        ? Number(value)
                        : value

        }));

    };
        //---------------------------------------------------------
    // Save Sales
    //---------------------------------------------------------

    const handleSave = async () => {

        try {

            const payload = {

                ...sales,

                items

            };

            if (isEdit) {

                await updateSales(

                    id,

                    payload

                );

                alert(

                    "Sales updated successfully."

                );

            }
            else {

                await createSales(

                    payload

                );

                alert(

                    "Sales created successfully."

                );

            }

            navigate("/sales");

        }
        catch (err) {

            console.error(err);

            alert(

                err.response?.data?.detail ||

                "Unable to save sales."

            );

        }

    };

    //---------------------------------------------------------
    // Cancel
    //---------------------------------------------------------

    const handleCancel = () => {

        navigate("/sales");

    };
        //---------------------------------------------------------
    // UI
    //---------------------------------------------------------

    return (

        <MainLayout>

            <Paper sx={{ p: 3 }}>

                <Typography

                    variant="h5"

                    fontWeight="bold"

                >

                    {isEdit

                        ? "Edit Sales"

                        : "Sales Entry"}

                </Typography>

                <Divider sx={{ my: 2 }} />

                <SalesHeader

                    sales={sales}

                    onChange={handleChange}

                />

                <SalesItemGrid

                    items={items}

                    setItems={setItems}

                />

                <SalesSummary

                    items={items}

                />

                <Box

                    sx={{

                        mt: 3,

                        display: "flex",

                        justifyContent: "flex-end",

                        gap: 2

                    }}

                >

                    <Button

                        variant="outlined"

                        onClick={handleCancel}

                    >

                        Cancel

                    </Button>

                    <Button

                        variant="contained"

                        onClick={handleSave}

                    >

                        {isEdit

                            ? "Update Sales"

                            : "Save Sales"}

                    </Button>

                </Box>

            </Paper>

        </MainLayout>

    );

}