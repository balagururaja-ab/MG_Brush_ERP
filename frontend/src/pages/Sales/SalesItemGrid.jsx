import { useEffect, useState } from "react";

import {
    Paper,
    Button,
    IconButton,
    MenuItem,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TextField
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import { getItems } from "../../api/itemApi";
// import { getUnits } from "../../api/unitApi";
// import { getTaxes } from "../../api/taxApi";

export default function SalesItemGrid({

    items,

    setItems

}) {

    const [itemMaster, setItemMaster] = useState([]);

    // const [unitMaster, setUnitMaster] = useState([]);

    // const [taxMaster, setTaxMaster] = useState([]);

    //---------------------------------------------------------
    // Load Masters
    //---------------------------------------------------------

    useEffect(() => {

        loadMasters();

    }, []);

    const loadMasters = async () => {

        try {

            const [

                items,

                // units,

                // taxes

            ] = await Promise.all([

                getItems()

                // getUnits(),

                // getTaxes()

            ]);

            setItemMaster(items);

            // setUnitMaster(units);

            // setTaxMaster(taxes);

        }
        catch (err) {

            console.error(err);

        }

    };

    //---------------------------------------------------------
    // Add Row
    //---------------------------------------------------------

    const addRow = () => {

        setItems([

            ...items,

            {
                item_id: "",
                quantity: 1,
                rate: 0,
                discount_percent: 0,
                discount_amount: 0,
                taxable_amount: 0,
                total_amount: 0
            }

        ]);

    };

    //---------------------------------------------------------
    // Delete Row
    //---------------------------------------------------------

    const deleteRow = (index) => {

        setItems(

            items.filter((_, i) => i !== index)

        );

    };

    //---------------------------------------------------------
    // Update Row
    //---------------------------------------------------------

    const updateRow = (
        index,
        field,
        value
    ) => {

        const updated = [...items];

        updated[index][field] = value;

        const row = updated[index];

        const gross =
            Number(row.quantity || 0) *
            Number(row.rate || 0);

        row.discount_amount =
            gross *
            (Number(row.discount_percent || 0) / 100);

        row.taxable_amount =
            gross -
            row.discount_amount;

        // Tax module not implemented yet
        row.cgst_amount = 0;
        row.sgst_amount = 0;
        row.igst_amount = 0;

        row.total_amount =
            row.taxable_amount;

        setItems(updated);

    };

    //---------------------------------------------------------
    // UI
    //---------------------------------------------------------

    return (

        <Paper sx={{ mt: 3, p: 2 }}>

            <Button

                variant="contained"

                startIcon={<AddIcon />}

                onClick={addRow}

                sx={{ mb: 2 }}

            >

                Add Item

            </Button>

            <Table>

                <TableHead>

                    <TableRow>

                        <TableCell>Item</TableCell>

                        <TableCell>Qty</TableCell>

                        <TableCell>Rate</TableCell>

                        <TableCell>Disc %</TableCell>

                        <TableCell>Total</TableCell>

                        <TableCell></TableCell>

                    </TableRow>

                </TableHead>

                <TableBody>

                    {items.map((row, index) => (

                        <TableRow key={index}>

                            <TableCell>

                                <TextField

                                    select

                                    size="small"

                                    value={row.item_id}

                                    onChange={(e) =>
                                        updateRow(
                                            index,
                                            "item_id",
                                            e.target.value
                                        )
                                    }

                                >

                                    {itemMaster.map(item => (

                                        <MenuItem

                                            key={item.item_id}

                                            value={item.item_id}

                                        >

                                            {item.item_name}

                                        </MenuItem>

                                    ))}

                                </TextField>

                            </TableCell>                            

                            <TableCell>

                                <TextField

                                    type="number"

                                    size="small"

                                    value={row.quantity}

                                    onChange={(e) =>
                                        updateRow(
                                            index,
                                            "quantity",
                                            Number(e.target.value)
                                        )
                                    }

                                />

                            </TableCell>

                            <TableCell>

                                <TextField

                                    type="number"

                                    size="small"

                                    value={row.rate}

                                    onChange={(e) =>
                                        updateRow(
                                            index,
                                            "rate",
                                            Number(e.target.value)
                                        )
                                    }

                                />

                            </TableCell>

                            <TableCell>

                                <TextField

                                    type="number"

                                    size="small"

                                    value={row.discount_percent}

                                    onChange={(e) =>
                                        updateRow(
                                            index,
                                            "discount_percent",
                                            Number(e.target.value)
                                        )
                                    }

                                />

                            </TableCell>                            

                            <TableCell>

                                {Number(row.total_amount).toFixed(2)}

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

                    ))}

                </TableBody>

            </Table>

        </Paper>

    );

}