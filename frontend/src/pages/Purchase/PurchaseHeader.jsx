import {

    Grid,
    TextField,
    MenuItem

} from "@mui/material";

import { useEffect, useState } from "react";

import { getSuppliers } from "../../api/supplierApi";

export default function PurchaseHeader({

    purchase,
    onChange

}) {

    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {

        loadSuppliers();

    }, []);

    async function loadSuppliers() {

        try {

            const data = await getSuppliers();

            setSuppliers(data);

        }
        catch (err) {

            console.error(err);

        }

    }

    return (

        <Grid
            container
            spacing={2}
        >

            <Grid size={{ xs:12, md:3 }}>

                <TextField

                    fullWidth

                    label="Purchase No"

                    name="purchase_no"

                    value={purchase.purchase_no}

                    disabled

                />

            </Grid>

            <Grid size={{ xs:12, md:3 }}>

                <TextField

                    fullWidth

                    type="date"

                    label="Purchase Date"

                    name="purchase_date"

                    value={purchase.purchase_date}

                    onChange={onChange}

                    InputLabelProps={{
                        shrink: true
                    }}

                />

            </Grid>

            <Grid size={{ xs:12, md:6 }}>

                <TextField

                    select

                    fullWidth

                    label="Supplier"

                    name="supplier_id"

                    value={purchase.supplier_id}

                    onChange={onChange}

                >

                    {

                        suppliers.map(s => (

                            <MenuItem

                                key={s.supplier_id}

                                value={s.supplier_id}

                            >

                                {s.supplier_name}

                            </MenuItem>

                        ))

                    }

                </TextField>

            </Grid>

            <Grid size={{ xs:12, md:4 }}>

                <TextField

                    fullWidth

                    label="Invoice No"

                    name="invoice_no"

                    value={purchase.invoice_no}

                    onChange={onChange}

                />

            </Grid>

            <Grid size={{ xs:12, md:4 }}>

                <TextField

                    fullWidth

                    type="date"

                    label="Invoice Date"

                    name="invoice_date"

                    value={purchase.invoice_date}

                    onChange={onChange}

                    InputLabelProps={{
                        shrink: true
                    }}

                />

            </Grid>

            <Grid size={{ xs:12, md:4 }}>

                <TextField

                    fullWidth

                    label="Remarks"

                    name="remarks"

                    value={purchase.remarks}

                    onChange={onChange}

                />

            </Grid>

        </Grid>

    );

}