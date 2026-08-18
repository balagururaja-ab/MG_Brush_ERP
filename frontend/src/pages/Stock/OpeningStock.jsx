import {

    useEffect,
    useState

} from "react";

import {

    Paper,

    Typography,

    TextField,

    MenuItem,

    Button,

    Grid,

    Stack,

    Alert,

    Box

} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";

import RestartAltIcon from "@mui/icons-material/RestartAlt";

import MainLayout from "../../layouts/MainLayout";

import {

    saveOpeningStock

} from "../../api/stockApi";

import {

    getItems

} from "../../api/itemApi";

const FINISHED_GOOD_CATEGORY_IDS = new Set([23, 24]);

export default function OpeningStock() {

    const [form, setForm] = useState({

        item_id: "",

        quantity: "",

        rate: ""

    });

    const [message, setMessage] = useState("");

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    const [items, setItems] = useState([]);

    useEffect(() => {

        loadItems();

    }, []);

    const loadItems = async () => {

        try {

            const data = await getItems();

            const rawMaterialItems = (data || []).filter(
                (item) => !FINISHED_GOOD_CATEGORY_IDS.has(Number(item.category_id))
            );

            setItems(rawMaterialItems);

        }
        catch (err) {

            console.error(err);

        }

    };

        const handleChange = (e) => {

        const {

            name,

            value

        } = e.target;

        setForm({

            ...form,

            [name]: value

        });

    };
        const resetForm = () => {

        setForm({

            item_id: "",

            quantity: "",

            rate: ""

        });

        setMessage("");

        setError("");

    };
        const handleSave = async () => {

        setMessage("");

        setError("");

        if (

            form.item_id === "" ||

            form.quantity === "" ||

            form.rate === ""

        ) {

            setError(

                "Please fill all mandatory fields."

            );

            return;

        }

        try {

            setLoading(true);

            await saveOpeningStock({

                item_id: Number(form.item_id),

                quantity: Number(form.quantity),

                rate: Number(form.rate)

            });

            setMessage(

                "Opening Stock saved successfully."

            );

            resetForm();

        }

        catch (err) {

            console.error(err);

            setError(

                err.response?.data?.detail ||

                "Unable to save Opening Stock."

            );

        }

        finally {

            setLoading(false);

        }

    };
        return (

        <MainLayout>

            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    maxWidth: 700,
                    mx: "auto"
                }}
            >

                <Typography
                    variant="h5"
                    fontWeight="bold"
                    mb={3}
                >

                    Opening Stock Entry

                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    mb={2}
                >
                    Only raw materials/components are allowed here. Finished brushes are blocked.
                </Typography>

                {

                    message && (

                        <Alert
                            severity="success"
                            sx={{ mb: 2 }}
                        >

                            {message}

                        </Alert>

                    )

                }

                {

                    error && (

                        <Alert
                            severity="error"
                            sx={{ mb: 2 }}
                        >

                            {error}

                        </Alert>

                    )

                }

                <Grid
                    container
                    spacing={3}
                >

                    <Grid size={{ xs: 12 }}>

                        <TextField

                            fullWidth

                            select

                            label="Item"

                            name="item_id"

                            value={form.item_id}

                            onChange={handleChange}

                            required

                        >

                            <MenuItem value="">
                                Select Item
                            </MenuItem>

                            {items.map((item) => (

                                <MenuItem

                                    key={item.item_id}

                                    value={item.item_id}

                                >

                                    {item.item_name}

                                </MenuItem>

                            ))}

                        </TextField>

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <TextField

                            fullWidth

                            label="Opening Quantity"

                            name="quantity"

                            type="number"

                            value={form.quantity}

                            onChange={handleChange}

                            required

                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>

                        <TextField

                            fullWidth

                            label="Opening Rate"

                            name="rate"

                            type="number"

                            value={form.rate}

                            onChange={handleChange}

                            required

                        />

                    </Grid>

                </Grid>

                <Box mt={4}>

                    <Stack

                        direction="row"

                        spacing={2}

                    >

                        <Button

                            variant="contained"

                            startIcon={<SaveIcon />}

                            onClick={handleSave}

                            disabled={loading}

                        >

                            {

                                loading

                                ?

                                "Saving..."

                                :

                                "Save"

                            }

                        </Button>

                        <Button

                            variant="outlined"

                            startIcon={<RestartAltIcon />}

                            onClick={resetForm}

                        >

                            Reset

                        </Button>

                    </Stack>

                </Box>

            </Paper>

        </MainLayout>

    );

}