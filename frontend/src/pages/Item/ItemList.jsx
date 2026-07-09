import { useEffect, useState } from "react";

import {
    Box,
    Button,
    Paper,
    TextField,
    Typography
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import AddIcon from "@mui/icons-material/Add";

import EditIcon from "@mui/icons-material/Edit";

import DeleteIcon from "@mui/icons-material/Delete";

import {
    getItems,
    deleteItem
} from "../../api/itemApi";

import ItemForm from "./ItemForm";

export default function ItemList() {

    const [items, setItems] = useState([]);

    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");

    const [open, setOpen] = useState(false);

    const [selectedItem, setSelectedItem] = useState(null);

    //----------------------------------------------------------
    // Load Items
    //----------------------------------------------------------

    const loadItems = async () => {

        setLoading(true);

        try {

            const data = await getItems();

            setItems(data);

        }
        catch (err) {

            console.error(err);

            alert("Unable to load items.");

        }
        finally {

            setLoading(false);

        }

    };

    //----------------------------------------------------------
    // Initial Load
    //----------------------------------------------------------

    useEffect(() => {

        loadItems();

    }, []);

    //----------------------------------------------------------
    // Delete Item
    //----------------------------------------------------------

    const handleDelete = async (itemId) => {

        if (!window.confirm("Delete selected item?")) {

            return;

        }

        try {

            await deleteItem(itemId);

            loadItems();

        }
        catch (err) {

            console.error(err);

            alert("Unable to delete item.");

        }

    };

    //----------------------------------------------------------
    // Search Filter
    //----------------------------------------------------------

    const filteredItems = items.filter(item =>

        item.item_code.toLowerCase().includes(search.toLowerCase()) ||

        item.item_name.toLowerCase().includes(search.toLowerCase())

    );

    //----------------------------------------------------------
    // Grid Columns
    //----------------------------------------------------------

    const columns = [

        {
            field: "item_code",
            headerName: "Code",
            width: 120
        },

        {
            field: "item_name",
            headerName: "Item Name",
            width: 260
        },

        {
            field: "item_type",
            headerName: "Type",
            width: 170
        },

        {
            field: "purchase_rate",
            headerName: "Purchase",
            width: 120,
            type: "number"
        },

        {
            field: "selling_rate",
            headerName: "Selling",
            width: 120,
            type: "number"
        },

        {
            field: "opening_stock",
            headerName: "Stock",
            width: 120,
            type: "number"
        },

        {
            field: "actions",
            headerName: "Actions",
            width: 220,
            sortable: false,

            renderCell: (params) => (

                <>

                    <Button

                        size="small"

                        startIcon={<EditIcon />}

                        onClick={() => {

                            setSelectedItem(params.row);

                            setOpen(true);

                        }}

                    >

                        Edit

                    </Button>

                    <Button

                        color="error"

                        size="small"

                        startIcon={<DeleteIcon />}

                        onClick={() =>
                            handleDelete(params.row.item_id)
                        }

                    >

                        Delete

                    </Button>

                </>

            )

        }

    ];

    //----------------------------------------------------------
    // UI
    //----------------------------------------------------------

    return (

        <Box>

            <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
            >
                Item Master
            </Typography>

            <Typography
                color="text.secondary"
                sx={{ mb: 3 }}
            >
                Manage Raw Materials, Finished Goods and Packing Items
            </Typography>

            <Paper sx={{ p: 2 }}>

                <Box

                    display="flex"

                    justifyContent="space-between"

                    alignItems="center"

                    mb={2}

                >

                    <TextField

                        label="Search Item"

                        size="small"

                        value={search}

                        onChange={(e) =>
                            setSearch(e.target.value)
                        }

                        sx={{ width: 350 }}

                    />

                    <Button

                        variant="contained"

                        startIcon={<AddIcon />}

                        onClick={() => {

                            setSelectedItem(null);

                            setOpen(true);

                        }}

                    >

                        Add Item

                    </Button>

                </Box>

                <DataGrid

                    rows={filteredItems}

                    columns={columns}

                    getRowId={(row) => row.item_id}

                    autoHeight

                    loading={loading}

                    pageSizeOptions={[10, 20, 50]}

                    initialState={{

                        pagination: {

                            paginationModel: {

                                pageSize: 10

                            }

                        }

                    }}

                />

            </Paper>

            <ItemForm

                open={open}

                item={selectedItem}

                onClose={() => {

                    setOpen(false);

                    loadItems();

                }}

            />

        </Box>

    );

}