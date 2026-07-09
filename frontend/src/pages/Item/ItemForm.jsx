import { useEffect, useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    TextField,
    Button,
    MenuItem
} from "@mui/material";

import {
    createItem,
    updateItem
} from "../../api/itemApi";

const emptyItem = {

    item_code: "",

    item_name: "",

    category_id: "",

    unit_id: "",

    tax_id: "",

    item_type: "RAW_MATERIAL",

    brush_size: "",

    bristle_type: "",

    handle_type: "",

    ferrule_type: "",

    color: "",

    purchase_rate: 0,

    selling_rate: 0,

    opening_stock: 0,

    minimum_stock: 0,

    maximum_stock: 0,

    reorder_level: 0,

    weight_per_piece: "",

    barcode: "",

    hsn_code: "",

    description: ""

};

export default function ItemForm({

    open,

    item,

    onClose

}) {

    const [form, setForm] = useState(emptyItem);

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (item) {

            setForm(item);

        }

        else {

            setForm(emptyItem);

        }

    }, [item]);

    //------------------------------------------------------

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };

    //------------------------------------------------------

    const handleSave = async () => {

        setLoading(true);

        try {

            if (item) {

                await updateItem(

                    item.item_id,

                    form

                );

            }

            else {

                await createItem(form);

            }

            onClose();

        }

        catch (err) {

            console.error(err);

            alert("Unable to save item.");

        }

        finally {

            setLoading(false);

        }

    };

    //------------------------------------------------------

    return (

        <Dialog

            open={open}

            onClose={onClose}

            maxWidth="md"

            fullWidth

        >

            <DialogTitle>

                {

                    item

                        ? "Edit Item"

                        : "Add Item"

                }

            </DialogTitle>

            <DialogContent>

                <Grid

                    container

                    spacing={2}

                    sx={{ mt: 1 }}

                >

                    <Grid item xs={6}>

                        <TextField

                            fullWidth

                            name="item_code"

                            label="Item Code"

                            value={form.item_code}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid item xs={6}>

                        <TextField

                            fullWidth

                            name="item_name"

                            label="Item Name"

                            value={form.item_name}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid item xs={4}>

                        <TextField

                            fullWidth

                            name="category_id"

                            label="Category Id"

                            type="number"

                            value={form.category_id}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid item xs={4}>

                        <TextField

                            fullWidth

                            name="unit_id"

                            label="Unit Id"

                            type="number"

                            value={form.unit_id}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid item xs={4}>

                        <TextField

                            fullWidth

                            name="tax_id"

                            label="Tax Id"

                            type="number"

                            value={form.tax_id}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid item xs={4}>

                        <TextField

                            fullWidth

                            select

                            name="item_type"

                            label="Item Type"

                            value={form.item_type}

                            onChange={handleChange}

                        >

                            <MenuItem value="RAW_MATERIAL">

                                RAW MATERIAL

                            </MenuItem>

                            <MenuItem value="FINISHED_GOOD">

                                FINISHED GOOD

                            </MenuItem>

                            <MenuItem value="SEMI_FINISHED">

                                SEMI FINISHED

                            </MenuItem>

                            <MenuItem value="PACKING">

                                PACKING

                            </MenuItem>

                        </TextField>

                    </Grid>

                    <Grid item xs={4}>

                        <TextField

                            fullWidth

                            name="brush_size"

                            label="Brush Size"

                            value={form.brush_size}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid item xs={4}>

                        <TextField

                            fullWidth

                            name="color"

                            label="Color"

                            value={form.color}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid item xs={4}>

                        <TextField

                            fullWidth

                            name="purchase_rate"

                            label="Purchase Rate"

                            type="number"

                            value={form.purchase_rate}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid item xs={4}>

                        <TextField

                            fullWidth

                            name="selling_rate"

                            label="Selling Rate"

                            type="number"

                            value={form.selling_rate}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid item xs={4}>

                        <TextField

                            fullWidth

                            name="opening_stock"

                            label="Opening Stock"

                            type="number"

                            value={form.opening_stock}

                            onChange={handleChange}

                        />

                    </Grid>

                    <Grid item xs={12}>

                        <TextField

                            fullWidth

                            multiline

                            rows={3}

                            name="description"

                            label="Description"

                            value={form.description}

                            onChange={handleChange}

                        />

                    </Grid>

                </Grid>

            </DialogContent>

            <DialogActions>

                <Button

                    onClick={onClose}

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

                            : "Save"

                    }

                </Button>

            </DialogActions>

        </Dialog>

    );

}