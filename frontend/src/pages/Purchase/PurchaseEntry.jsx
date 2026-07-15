import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Paper,
    Typography,
    Divider,
    Button,
    Box
} from "@mui/material";

import MainLayout from "../../layouts/MainLayout";
import PurchaseHeader from "./PurchaseHeader";
import PurchaseItemGrid from "./PurchaseItemGrid";
import PurchaseSummary from "./PurchaseSummary";
import { createPurchase } from "../../api/purchaseApi";

export default function PurchaseEntry() {

    const [purchase, setPurchase] = useState({

        purchase_no: "",

        purchase_date: new Date()
            .toISOString()
            .substring(0, 10),

        supplier_id: "",

        invoice_no: "",

        invoice_date: new Date()
            .toISOString()
            .substring(0, 10),

        remarks: ""

    });

    const [items, setItems] = useState([]);

    const navigate = useNavigate();

    const handleChange = (e) => {

        const { name, value } = e.target;

        setPurchase(prev => ({
            ...prev,
            [name]: value
        }));

    };

    const handleSave = async () => {

        try {

            const payload = {

                ...purchase,

                items

            };

            console.log(payload);
            
            const response = await createPurchase(payload);

            alert(response.message);

        }
        catch (err) {

            console.error(err);

            alert(err.response?.data?.detail || "Unable to save purchase.");

        }

    };

    return (

        <MainLayout>

            <Paper sx={{ p: 3 }}>

                <Typography
                    variant="h5"
                    fontWeight="bold"
                >
                    Purchase Entry
                </Typography>

                <Divider sx={{ my: 2 }} />

                <PurchaseHeader
                    purchase={purchase}
                    onChange={handleChange}
                />
                
                <PurchaseItemGrid
                    items={items}
                    setItems={setItems}
                />

                <PurchaseSummary
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
                        onClick={() => navigate("/purchases")}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleSave}
                    >
                        Save Purchase
                    </Button>

                </Box>

            </Paper>

        </MainLayout>

    );

}