import { useEffect, useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    TextField,
    Button,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
} from "@mui/material";

import {
    createItem,
    updateItem,
    getCategories,
    getUnits,
    getTaxes
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

    weight_per_piece: null,

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

    const [categories, setCategories] = useState([]);
    const [units, setUnits] = useState([]);
    const [taxes, setTaxes] = useState([]);

    const loadCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (err) {
            console.error(err);
        }
    };

    const loadUnits = async () => {
        try {
            const data = await getUnits();
            setUnits(data);
        } catch (err) {
            console.error(err);
        }
    };

    const loadTaxes = async () => {
        try {
            const data = await getTaxes();
            setTaxes(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {

        loadCategories();
        loadUnits();
        loadTaxes();

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

            const payload = {

                ...form,

                category_id:
                    form.category_id === ""
                        ? null
                        : Number(form.category_id),

                unit_id:
                    form.unit_id === ""
                        ? null
                        : Number(form.unit_id),

                tax_id:
                    form.tax_id === ""
                        ? null
                        : Number(form.tax_id),

                purchase_rate:
                    form.purchase_rate === ""
                        ? 0
                        : Number(form.purchase_rate),

                selling_rate:
                    form.selling_rate === ""
                        ? 0
                        : Number(form.selling_rate),

                opening_stock:
                    form.opening_stock === ""
                        ? 0
                        : Number(form.opening_stock),

                minimum_stock:
                    form.minimum_stock === ""
                        ? null
                        : Number(form.minimum_stock),

                maximum_stock:
                    form.maximum_stock === ""
                        ? null
                        : Number(form.maximum_stock),

                reorder_level:
                    form.reorder_level === ""
                        ? null
                        : Number(form.reorder_level),

                weight_per_piece:
                    form.weight_per_piece === ""
                        ? null
                        : Number(form.weight_per_piece)

            };

            if (item) {

                await updateItem(item.item_id, payload);

            }
            else {

                await createItem(payload);

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

                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>

                            <Select
                                name="category_id"
                                value={form.category_id}
                                onChange={handleChange}
                            >
                                {categories.map((c) => (
                                    <MenuItem
                                        key={c.category_id}
                                        value={c.category_id}
                                    >
                                        {c.category_name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                    </Grid>

                    <Grid item xs={4}>

                        <FormControl fullWidth>
                            <InputLabel>Unit</InputLabel>

                            <Select
                                name="unit_id"
                                value={form.unit_id}
                                onChange={handleChange}
                            >
                                {units.map((u) => (
                                    <MenuItem
                                        key={u.unit_id}
                                        value={u.unit_id}
                                    >
                                        {u.unit_name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                    </Grid>

                    <Grid item xs={4}>

                        <FormControl fullWidth>
                            <InputLabel>Tax</InputLabel>

                            <Select
                                name="tax_id"
                                value={form.tax_id}
                                onChange={handleChange}
                            >
                                {taxes.map((t) => (
                                    <MenuItem
                                        key={t.tax_id}
                                        value={t.tax_id}
                                    >
                                        {t.tax_name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

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