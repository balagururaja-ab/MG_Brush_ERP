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

    const getItemSpec = (item) => {

        const parts = [
            item.brush_size,
            item.bristle_type,
            item.handle_type,
            item.ferrule_type,
            item.color
        ]
            .map(value => String(value || "").trim())
            .filter(Boolean);

        return parts.length > 0
            ? parts.join(" | ")
            : "-";

    };

    const getSizeTypeOptions = (item) => {

        const itemText = String(
            item?.item_name || ""
        ).toLowerCase();

        const bristleText = String(
            item?.bristle_type || ""
        ).toLowerCase();

        const handleText = String(
            item?.handle_type || ""
        ).toLowerCase();

        if (
            bristleText.includes("hog") ||
            bristleText.includes("magic") ||
            bristleText.includes("taper bristle") ||
            bristleText.includes("taper") ||
            bristleText.includes("chinese taper") ||
            itemText.includes("hog") ||
            itemText.includes("magic") ||
            itemText.includes("taper bristle") ||
            itemText.includes("taper") ||
            itemText.includes("chinese taper")
        ) {
            return [
                "57mm",
                "64mm",
                "70mm",
                "76mm",
                "83mm",
                "89mm",
                "95mm"
            ];
        }

        if (
            handleText.includes("plastic") ||
            itemText.includes("plastic")
        ) {
            return [
                "1 inch",
                "1.5 inch",
                "2 inch",
                "2.5 inch",
                "3 inch",
                "4 inch"
            ];
        }

        if (
            handleText.includes("wood") ||
            itemText.includes("wood")
        ) {
            return [
                "1 inch",
                "1.5 inch",
                "2 inch",
                "2.5 inch",
                "3 inch",
                "4 inch"
            ];
        }

        return [];

    };

    const isPurchaseRawMaterialItem = (item) => {

        const itemText = String(
            item?.item_name || ""
        ).toLowerCase();

        // Raw-material purchase excludes finished brush items and white bristles.
        if (
            itemText.includes("abhi brush") ||
            itemText.includes("selvi brush") ||
            itemText.includes("selvi spl brush") ||
            itemText.includes("chinese white bristles")
        ) {
            return false;
        }

        return true;

    };

    const getDisplayItemName = (item) => {

        const itemName = String(item?.item_name || "").trim();

        if (itemName.toLowerCase().includes("chinese taper")) {
            return "Taper";
        }

        return itemName;

    };

    //-------------------------------------------------------
    // Add Row
    //-------------------------------------------------------

    const addRow = () => {

        setItems([
            ...items,
            {
                item_id: "",
                item_spec: "",
                unit_id: "",
                quantity: 1,
                rate: 0,

                discount_percent: 0,

                tax_id: "",

                discount_amount: 0,
                taxable_amount: 0,

                tax_percent: 0,

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

                const sizeTypeOptions = getSizeTypeOptions(item);

                data[index].rate = Number(item.purchase_rate);

                data[index].unit_id = item.unit_id;

                data[index].tax_id = item.tax_id;

                if (
                    data[index].tax_percent === "" ||
                    data[index].tax_percent === null ||
                    typeof data[index].tax_percent === "undefined"
                ) {
                    data[index].tax_percent = 0;
                }

                data[index].item_spec = sizeTypeOptions.length > 0
                    ? (
                        sizeTypeOptions.includes(data[index].item_spec)
                            ? data[index].item_spec
                            : sizeTypeOptions[0]
                    )
                    : getItemSpec(item);
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

        const taxPercent = Number(
            data[index].tax_percent || 0
        );

        const gst = taxableAmount * taxPercent / 100;

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

                        <TableCell width="30%">
                            Item
                        </TableCell>

                                <TableCell width="22%">
                                    Size / Type
                                </TableCell>

                        <TableCell width="10%">
                            Qty
                        </TableCell>

                        <TableCell width="10%">
                            Rate
                        </TableCell>

                        <TableCell width="10%">
                            GST %
                        </TableCell>                        

                        <TableCell width="13%">
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

                                            itemMaster
                                                .filter(isPurchaseRawMaterialItem)
                                                .map(item => (

                                                <MenuItem

                                                    key={item.item_id}

                                                    value={item.item_id}

                                                >

                                                    {getDisplayItemName(item)}

                                                </MenuItem>

                                            ))

                                        }

                                    </TextField>

                                </TableCell>

                                <TableCell>

                                    {(() => {

                                        const selectedItem = itemMaster.find(
                                            item => item.item_id === Number(row.item_id)
                                        );

                                        const sizeTypeOptions = getSizeTypeOptions(selectedItem);

                                        if (sizeTypeOptions.length === 0) {

                                            return (

                                                <TextField

                                                    fullWidth

                                                    value={row.item_spec || "-"}

                                                    InputProps={{
                                                        readOnly: true
                                                    }}

                                                />

                                            );

                                        }

                                        return (

                                            <TextField

                                                select

                                                fullWidth

                                                value={row.item_spec || ""}

                                                onChange={(e) =>
                                                    handleChange(
                                                        index,
                                                        "item_spec",
                                                        e.target.value
                                                    )
                                                }

                                                SelectProps={{
                                                    displayEmpty: true
                                                }}

                                            >

                                                <MenuItem value="">

                                                    Select size / type

                                                </MenuItem>

                                                {sizeTypeOptions.map(option => (

                                                    <MenuItem

                                                        key={option}

                                                        value={option}

                                                    >

                                                        {option}

                                                    </MenuItem>

                                                ))}

                                            </TextField>

                                        );

                                    })()}

                                </TableCell>

                                <TableCell>

                                    <TextField

                                        type="number"

                                        fullWidth

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

                                        fullWidth

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

                                        fullWidth

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