import { useEffect, useState } from "react";

import {
    Paper,
    Grid,
    TextField,
    Typography,
    Button,
    FormControlLabel,
    Checkbox,
    Box
} from "@mui/material";

import { useNavigate, useParams } from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";

import {
    createCustomer,
    updateCustomer,
    getCustomer
} from "../../api/customerApi";

export default function CustomerForm() {

    const navigate = useNavigate();

    const { id } = useParams();

    const isEdit = !!id;

    const [customer, setCustomer] = useState({

        customer_code: "",

        customer_name: "",

        contact_person: "",

        gstin: "",

        pan_number: "",

        phone: "",

        mobile: "",

        email: "",

        address1: "",

        address2: "",

        city: "",

        state: "",

        pincode: "",

        country: "India",

        credit_limit: 0,

        credit_days: 0,

        remarks: "",

        is_active: true

    });

    //---------------------------------------------------------
    // Load Customer
    //---------------------------------------------------------

    useEffect(() => {

        if (isEdit) {

            loadCustomer();

        }

    }, []);

    const loadCustomer = async () => {

        try {

            const data = await getCustomer(id);

            setCustomer(data);

        }
        catch (err) {

            console.error(err);

            alert("Unable to load customer.");

        }

    };

    //---------------------------------------------------------
    // Handle Change
    //---------------------------------------------------------

    const handleChange = (e) => {

        const { name, value, checked, type } = e.target;

        setCustomer(prev => ({

            ...prev,

            [name]:
                type === "checkbox"
                    ? checked
                    : value

        }));

    };
        //---------------------------------------------------------
    // Save Customer
    //---------------------------------------------------------

    const handleSave = async () => {

        try {

            if (isEdit) {

                await updateCustomer(
                    id,
                    customer
                );

                alert(
                    "Customer updated successfully."
                );

            }
            else {

                await createCustomer(
                    customer
                );

                alert(
                    "Customer created successfully."
                );

            }

            navigate("/customers");

        }
        catch (err) {

            console.error(err);

            alert(
                err.response?.data?.detail ||
                "Unable to save customer."
            );

        }

    };

    //---------------------------------------------------------
    // Cancel
    //---------------------------------------------------------

    const handleCancel = () => {

        navigate("/customers");

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
                    mb={3}
                >
                    {isEdit
                        ? "Edit Customer"
                        : "New Customer"}
                </Typography>

                <Grid
                    container
                    spacing={2}
                >

                    <Grid size={{ xs: 12, md: 3 }}>

                        <TextField

                            fullWidth

                            label="Customer Code"

                            name="customer_code"

                            value={customer.customer_code}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 9 }}>

                        <TextField

                            fullWidth

                            label="Customer Name"

                            name="customer_name"

                            value={customer.customer_name}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <TextField

                            fullWidth

                            label="Contact Person"

                            name="contact_person"

                            value={customer.contact_person}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>

                        <TextField

                            fullWidth

                            label="Mobile"

                            name="mobile"

                            value={customer.mobile}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>

                        <TextField

                            fullWidth

                            label="Phone"

                            name="phone"

                            value={customer.phone}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid size={{ xs: 12 }}>

                        <TextField

                            fullWidth

                            label="Email"

                            name="email"

                            value={customer.email}

                            onChange={handleChange}

                        />

                    </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>

                        <TextField

                            fullWidth

                            label="GSTIN"

                            name="gstin"

                            value={customer.gstin}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <TextField

                            fullWidth

                            label="PAN Number"

                            name="pan_number"

                            value={customer.pan_number}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid size={{ xs: 12 }}>

                        <TextField

                            fullWidth

                            label="Address Line 1"

                            name="address1"

                            value={customer.address1}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid size={{ xs: 12 }}>

                        <TextField

                            fullWidth

                            label="Address Line 2"

                            name="address2"

                            value={customer.address2}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>

                        <TextField

                            fullWidth

                            label="City"

                            name="city"

                            value={customer.city}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>

                        <TextField

                            fullWidth

                            label="State"

                            name="state"

                            value={customer.state}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>

                        <TextField

                            fullWidth

                            label="Pincode"

                            name="pincode"

                            value={customer.pincode}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>

                        <TextField

                            fullWidth

                            label="Country"

                            name="country"

                            value={customer.country}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <TextField

                            fullWidth

                            type="number"

                            label="Credit Limit"

                            name="credit_limit"

                            value={customer.credit_limit}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <TextField

                            fullWidth

                            type="number"

                            label="Credit Days"

                            name="credit_days"

                            value={customer.credit_days}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid size={{ xs: 12 }}>

                        <TextField

                            fullWidth

                            multiline

                            rows={3}

                            label="Remarks"

                            name="remarks"

                            value={customer.remarks}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid size={{ xs: 12 }}>

                        <FormControlLabel

                            control={

                                <Checkbox

                                    checked={customer.is_active}

                                    onChange={handleChange}

                                    name="is_active"

                                />

                            }

                            label="Active"

                        />

                    </Grid>

                </Grid>

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

                        {isEdit ? "Update" : "Save"}

                    </Button>

                </Box>

            </Paper>

        </MainLayout>

    );

}