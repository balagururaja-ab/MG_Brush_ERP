import { useEffect, useState } from "react";

import {
    Grid,
    TextField,
    MenuItem
} from "@mui/material";

import { getCustomers } from "../../api/customerApi";

export default function SalesHeader({

    sales,

    onChange

}) {

    const [customers, setCustomers] = useState([]);

    //---------------------------------------------------------
    // Load Customers
    //---------------------------------------------------------

    useEffect(() => {

        loadCustomers();

    }, []);

    const loadCustomers = async () => {

        try {

            const data = await getCustomers();

            setCustomers(data);

        }
        catch (err) {

            console.error(err);

            alert("Unable to load customers.");

        }

    };

    //---------------------------------------------------------
    // UI
    //---------------------------------------------------------

    return (

        <Grid
            container
            spacing={2}
        >

            <Grid size={{ xs: 12, md: 3 }}>

                <TextField

                    fullWidth

                    label="Sales Date"

                    type="date"

                    name="sales_date"

                    value={sales.sales_date}

                    onChange={onChange}

                    InputLabelProps={{
                        shrink: true
                    }}

                />

            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>

                <TextField

                    fullWidth

                    label="Invoice No"

                    name="invoice_no"

                    value={sales.invoice_no}

                    onChange={onChange}

                />

            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>

                <TextField

                    fullWidth

                    type="date"

                    label="Invoice Date"

                    name="invoice_date"

                    value={sales.invoice_date}

                    onChange={onChange}

                    InputLabelProps={{
                        shrink: true
                    }}

                />

            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>

                <TextField

                    fullWidth

                    select

                    label="Customer"

                    name="customer_id"

                    value={sales.customer_id}

                    onChange={onChange}

                >

                    <MenuItem value="">
                        Select Customer
                    </MenuItem>

                    {customers.map(customer => (

                        <MenuItem

                            key={customer.customer_id}

                            value={customer.customer_id}

                        >

                            {customer.customer_name}

                        </MenuItem>

                    ))}

                </TextField>

            </Grid>
                        <Grid size={{ xs: 12, md: 3 }}>

                <TextField

                    fullWidth

                    select

                    label="Payment Status"

                    name="payment_status"

                    value={sales.payment_status}

                    onChange={onChange}

                >

                    <MenuItem value="PENDING">
                        Pending
                    </MenuItem>

                    <MenuItem value="PAID">
                        Paid
                    </MenuItem>

                    <MenuItem value="PARTIAL">
                        Partial
                    </MenuItem>

                </TextField>

            </Grid>

            <Grid size={{ xs: 12, md: 9 }}>

                <TextField

                    fullWidth

                    label="Remarks"

                    name="remarks"

                    value={sales.remarks}

                    onChange={onChange}

                />

            </Grid>

        </Grid>

    );

}