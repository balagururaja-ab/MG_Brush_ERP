import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    TextField,
    Typography
} from "@mui/material";

import {
    useEffect,
    useState
} from "react";

import {
    createSupplier,
    updateSupplier
} from "../../api/supplierApi";

const emptySupplier = {

    supplier_code: "",
    supplier_name: "",
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

    payment_terms: "",
    credit_days: 0,

    bank_name: "",
    account_number: "",
    ifsc_code: "",

    remarks: ""

};

export default function SupplierForm({

    open,
    onClose,
    supplier,
    refresh

}) {

    const [form, setForm] =
        useState(emptySupplier);

    const [loading, setLoading] =
        useState(false);

    const [errors, setErrors] =
        useState({});

    useEffect(() => {

        if (supplier) {

            setForm(supplier);

        }
        else {

            setForm(emptySupplier);

        }

        setErrors({});

    }, [supplier, open]);

    //-------------------------------------------------------
    // Handle Change
    //-------------------------------------------------------

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };

    //-------------------------------------------------------
    // Validation
    //-------------------------------------------------------

    const validate = () => {

        let validation = {};

        if (!form.supplier_code.trim()) {

            validation.supplier_code =
                "Supplier Code is required.";

        }

        if (!form.supplier_name.trim()) {

            validation.supplier_name =
                "Supplier Name is required.";

        }

        if (
            form.email &&
            !/\S+@\S+\.\S+/.test(form.email)
        ) {

            validation.email =
                "Invalid Email.";

        }

        setErrors(validation);

        return Object.keys(validation).length === 0;

    };

    //-------------------------------------------------------
    // Save
    //-------------------------------------------------------

    const handleSave = async () => {

        if (!validate())
            return;

        try {

            setLoading(true);

            if (supplier) {

                await updateSupplier(
                    supplier.supplier_id,
                    form
                );

            }
            else {

                await createSupplier(form);

            }

            refresh();

            onClose();

        }
        catch (err) {

            alert(

                err.response?.data?.detail ||

                "Unable to save supplier."

            );

        }
        finally {

            setLoading(false);

        }

    };

    return (

        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
        >

            <DialogTitle>

                <Typography variant="h6">

                    {

                        supplier

                            ? "Edit Supplier"

                            : "New Supplier"

                    }

                </Typography>

            </DialogTitle>

            <DialogContent>

                <Grid
                    container
                    spacing={2}
                    sx={{ mt: 1 }}
                >
                                      {/* ---------------------------------------- */}
                    {/* General Information */}
                    {/* ---------------------------------------- */}

                    <Grid size={{ xs: 12 }}>
                        <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                        >
                            General Information
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            fullWidth
                            label="Supplier Code"
                            name="supplier_code"
                            value={form.supplier_code}
                            onChange={handleChange}
                            error={!!errors.supplier_code}
                            helperText={errors.supplier_code}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 5 }}>
                        <TextField
                            fullWidth
                            label="Supplier Name"
                            name="supplier_name"
                            value={form.supplier_name}
                            onChange={handleChange}
                            error={!!errors.supplier_name}
                            helperText={errors.supplier_name}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            fullWidth
                            label="Contact Person"
                            name="contact_person"
                            value={form.contact_person}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="GSTIN"
                            name="gstin"
                            value={form.gstin}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="PAN Number"
                            name="pan_number"
                            value={form.pan_number}
                            onChange={handleChange}
                        />
                    </Grid>

                    {/* ---------------------------------------- */}
                    {/* Contact Details */}
                    {/* ---------------------------------------- */}

                    <Grid size={{ xs: 12 }}>
                        <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            sx={{ mt: 2 }}
                        >
                            Contact Details
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            fullWidth
                            label="Phone"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            fullWidth
                            label="Mobile"
                            name="mobile"
                            value={form.mobile}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                        />
                    </Grid>

                    {/* ---------------------------------------- */}
                    {/* Address */}
                    {/* ---------------------------------------- */}

                    <Grid size={{ xs: 12 }}>
                        <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            sx={{ mt: 2 }}
                        >
                            Address
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Address Line 1"
                            name="address1"
                            value={form.address1}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            label="Address Line 2"
                            name="address2"
                            value={form.address2}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            fullWidth
                            label="City"
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            fullWidth
                            label="State"
                            name="state"
                            value={form.state}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            fullWidth
                            label="Pincode"
                            name="pincode"
                            value={form.pincode}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            fullWidth
                            label="Country"
                            name="country"
                            value={form.country}
                            onChange={handleChange}
                        />
                    </Grid>
                                        {/* ---------------------------------------- */}
                    {/* Payment Details */}
                    {/* ---------------------------------------- */}

                    <Grid size={{ xs: 12 }}>
                        <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            sx={{ mt: 2 }}
                        >
                            Payment Details
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Payment Terms"
                            name="payment_terms"
                            value={form.payment_terms}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Credit Days"
                            name="credit_days"
                            value={form.credit_days}
                            onChange={handleChange}
                        />
                    </Grid>

                    {/* ---------------------------------------- */}
                    {/* Bank Details */}
                    {/* ---------------------------------------- */}

                    <Grid size={{ xs: 12 }}>
                        <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            sx={{ mt: 2 }}
                        >
                            Bank Details
                        </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            fullWidth
                            label="Bank Name"
                            name="bank_name"
                            value={form.bank_name}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            fullWidth
                            label="Account Number"
                            name="account_number"
                            value={form.account_number}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            fullWidth
                            label="IFSC Code"
                            name="ifsc_code"
                            value={form.ifsc_code}
                            onChange={handleChange}
                        />
                    </Grid>

                    {/* ---------------------------------------- */}
                    {/* Remarks */}
                    {/* ---------------------------------------- */}

                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Remarks"
                            name="remarks"
                            value={form.remarks}
                            onChange={handleChange}
                        />
                    </Grid>

                </Grid>

            </DialogContent>

            <DialogActions>

                <Button
                    onClick={onClose}
                    color="inherit"
                >
                    Cancel
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={loading}
                >
                    {

                        loading

                            ? "Saving..."

                            : supplier

                                ? "Update"

                                : "Save"

                    }
                </Button>

            </DialogActions>

        </Dialog>

    );

}