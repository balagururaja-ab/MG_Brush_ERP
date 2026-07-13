import { useEffect, useState } from "react";

import {
    Paper,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TextField,
    MenuItem,
    IconButton,
    Button
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import { getItems } from "../../api/itemApi";

export default function PurchaseItemGrid({

    items,
    setItems

}) {

    const [itemMaster, setItemMaster] = useState([]);

    useEffect(() => {

        loadItems();

    }, []);

    async function loadItems() {

        try {

            const data = await getItems();

            setItemMaster(data);

        }
        catch (err) {

            console.error(err);

        }

    }

    //-------------------------------------------------------
    // Add Row
    //-------------------------------------------------------

    const addRow = () => {

        setItems([
            ...items,
            {
                item_id: "",
                unit_id: "",
                quantity: 1,
                rate: 0,

                discount_percent: 0,

                tax_id: "",

                discount_amount: 0,
                taxable_amount: 0,

                cgst_amount: 0,
                sgst_amount: 0,
                igst_amount: 0,

                total_amount: 0
            }
        ]);

    };

    //-------------------------------------------------------
    // Delete Row
    //-------------------------------------------------------

    const deleteRow = (index) => {

        const data = [...items];

        data.splice(index, 1);

        setItems(data);

    };

    //-------------------------------------------------------
    // Change Cell
    //-------------------------------------------------------

    const handleChange = (

        index,
        field,
        value

    ) => {

        const data = [...items];

        data[index][field] = value;

        //---------------------------------------------------
        // Auto fill purchase rate
        //---------------------------------------------------

        if (field === "item_id") {

            const item = itemMaster.find(

                x => x.item_id === Number(value)

            );

            if (item) {

                data[index].rate = Number(item.purchase_rate);

                data[index].unit_id = item.unit_id;

                data[index].tax_id = item.tax_id;
            }

        }

        //---------------------------------------------------
        // Amount
        //---------------------------------------------------

        const qty = Number(data[index].quantity || 0);

        const rate = Number(data[index].rate || 0);

        const discountPercent = Number(
            data[index].discount_percent || 0
        );

        const lineAmount = qty * rate;

        const discountAmount =
            lineAmount * discountPercent / 100;

        const taxableAmount =
            lineAmount - discountAmount;

        const gst = taxableAmount * 0.18;

        data[index].discount_amount =
            Number(discountAmount.toFixed(2));

        data[index].taxable_amount =
            Number(taxableAmount.toFixed(2));

        data[index].cgst_amount =
            Number((gst / 2).toFixed(2));

        data[index].sgst_amount =
            Number((gst / 2).toFixed(2));

        data[index].igst_amount = 0;

        data[index].total_amount =
            Number((taxableAmount + gst).toFixed(2));

        setItems(data);

    };

    return (

        <Paper sx={{ mt: 3 }}>

            <Table>

                <TableHead>

                    <TableRow>

                        <TableCell width="35%">
                            Item
                        </TableCell>

                        <TableCell>
                            Qty
                        </TableCell>

                        <TableCell>
                            Rate
                        </TableCell>

                        <TableCell>
                            Disc %
                        </TableCell>                        

                        <TableCell>
                            Amount
                        </TableCell>

                        <TableCell>
                        </TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {

                        items.map((row, index) => (

                            <TableRow key={index}>

                                <TableCell>

                                    <TextField

                                        select

                                        fullWidth

                                        value={row.item_id}

                                        onChange={(e) =>
                                            handleChange(
                                                index,
                                                "item_id",
                                                e.target.value
                                            )
                                        }

                                    >

                                        {

                                            itemMaster.map(item => (

                                                <MenuItem

                                                    key={item.item_id}

                                                    value={item.item_id}

                                                >

                                                    {item.item_name}

                                                </MenuItem>

                                            ))

                                        }

                                    </TextField>

                                </TableCell>

                                <TableCell>

                                    <TextField

                                        type="number"

                                        value={row.quantity}

                                        onChange={(e) =>
                                            handleChange(
                                                index,
                                                "quantity",
                                                e.target.value
                                            )
                                        }

                                    />

                                </TableCell>

                                <TableCell>

                                    <TextField

                                        type="number"

                                        value={row.rate}

                                        onChange={(e) =>
                                            handleChange(
                                                index,
                                                "rate",
                                                e.target.value
                                            )
                                        }

                                    />

                                </TableCell>

                                <TableCell>

                                    <TextField

                                        type="number"

                                        value={
                                            row.discount_percent
                                        }

                                        onChange={(e) =>
                                            handleChange(
                                                index,
                                                "discount_percent",
                                                e.target.value
                                            )
                                        }

                                    />

                                </TableCell>

                                <TableCell>

                                    <TextField

                                        type="number"

                                        value={row.tax_percent}

                                        onChange={(e) =>
                                            handleChange(
                                                index,
                                                "tax_percent",
                                                e.target.value
                                            )
                                        }

                                    />

                                </TableCell>

                                <TableCell>

                                    <TextField
                                        fullWidth
                                        value={row.total_amount}
                                        InputProps={{
                                            readOnly: true
                                        }}
                                    />

                                </TableCell>

                                <TableCell>

                                    <IconButton

                                        color="error"

                                        onClick={() =>
                                            deleteRow(index)
                                        }

                                    >

                                        <DeleteIcon />

                                    </IconButton>

                                </TableCell>

                            </TableRow>

                        ))

                    }

                </TableBody>

            </Table>

            <Button

                startIcon={<AddIcon />}

                sx={{ m: 2 }}

                variant="contained"

                onClick={addRow}

            >

                Add Item

            </Button>

        </Paper>

    );

}