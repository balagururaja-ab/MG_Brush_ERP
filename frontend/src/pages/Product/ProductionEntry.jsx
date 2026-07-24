import {

    useEffect,
    useState

} from "react";

import {

    useNavigate,
    useParams

} from "react-router-dom";

import {

    Box,

    Button,

    Grid,

    Paper,

    Typography,

    TextField,

    MenuItem,

    IconButton,

    Divider,

    Table,

    TableHead,

    TableBody,

    TableRow,

    TableCell,

    TableContainer,

    CircularProgress

} from "@mui/material";

import Stack from "@mui/material/Stack";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import {

    createProduction,
    updateProduction,
    getProduction

} from "../../api/productionApi";

import {

    getItems

} from "../../api/itemApi";

const ProductionEntry = () => {

    //----------------------------------------------------------
    // Hooks
    //----------------------------------------------------------

    const navigate = useNavigate();

    const { id } = useParams();

    const isEdit = !!id;

    //----------------------------------------------------------
    // Loading
    //----------------------------------------------------------

    const [loading, setLoading] = useState(false);

    //----------------------------------------------------------
    // Item Masters
    //----------------------------------------------------------

    const [rawMaterialItems, setRawMaterialItems] = useState([]);

    const [finishedGoodsItems, setFinishedGoodsItems] = useState([]);

    //----------------------------------------------------------
    // Header
    //----------------------------------------------------------

    const [production, setProduction] = useState({

        production_no: "",

        production_date: new Date()

            .toISOString()

            .substring(0, 10),

        status: "COMPLETED",

        remarks: ""

    });

    //----------------------------------------------------------
    // Raw Materials
    //----------------------------------------------------------

    const [rmItems, setRmItems] = useState([

        {

            item_id: "",

            quantity: "",

            remarks: ""

        }

    ]);

    //----------------------------------------------------------
    // Finished Goods
    //----------------------------------------------------------

    const [fgItems, setFgItems] = useState([

        {

            item_id: "",

            quantity: "",

            remarks: ""

        }

    ]);

    //----------------------------------------------------------
    // Load Master Data
    //----------------------------------------------------------

    useEffect(() => {

        loadItems();

        if (isEdit) {

            loadProduction();

        }

    }, []);

    //----------------------------------------------------------
    // Load Items
    //----------------------------------------------------------

    const loadItems = async () => {

        try {

            const items = await getItems();

            setRawMaterialItems(

                items.filter(

                    x =>

                        x.category_id !== 23 &&

                        x.category_id !== 24

                )

            );

            setFinishedGoodsItems(

                items.filter(

                    x =>

                        x.category_id === 23 ||

                        x.category_id === 24

                )

            );

        }

        catch (error) {

            console.error(error);

        }

    };

    //----------------------------------------------------------
    // Load Existing Production
    //----------------------------------------------------------

    const loadProduction = async () => {

        try {

            setLoading(true);

            const data = await getProduction(id);

            setProduction(data.production);

            setRmItems(data.rm_items);

            setFgItems(data.fg_items);

        }

        finally {

            setLoading(false);

        }

    };
        //----------------------------------------------------------
    // Header Change
    //----------------------------------------------------------

    const handleHeaderChange = (e) => {

        const {

            name,

            value

        } = e.target;

        setProduction((prev) => ({

            ...prev,

            [name]: value

        }));

    };

    //----------------------------------------------------------
    // Add Raw Material Row
    //----------------------------------------------------------

    const addRmRow = () => {

        setRmItems([

            ...rmItems,

            {

                item_id: "",

                quantity: "",

                remarks: ""

            }

        ]);

    };

    //----------------------------------------------------------
    // Delete Raw Material Row
    //----------------------------------------------------------

    const deleteRmRow = (index) => {

        const rows = [...rmItems];

        rows.splice(index, 1);

        setRmItems(rows);

    };

    //----------------------------------------------------------
    // Raw Material Change
    //----------------------------------------------------------

    const handleRmChange = (

        index,

        field,

        value

    ) => {

        const rows = [...rmItems];

        rows[index][field] = value;

        setRmItems(rows);

    };

    //----------------------------------------------------------
    // Add Finished Goods Row
    //----------------------------------------------------------

    const addFgRow = () => {

        setFgItems([

            ...fgItems,

            {

                item_id: "",

                quantity: "",

                remarks: ""

            }

        ]);

    };

    //----------------------------------------------------------
    // Delete Finished Goods Row
    //----------------------------------------------------------

    const deleteFgRow = (index) => {

        const rows = [...fgItems];

        rows.splice(index, 1);

        setFgItems(rows);

    };

    //----------------------------------------------------------
    // Finished Goods Change
    //----------------------------------------------------------

    const handleFgChange = (

        index,

        field,

        value

    ) => {

        const rows = [...fgItems];

        rows[index][field] = value;

        setFgItems(rows);

    };

    //----------------------------------------------------------
    // Save Production
    //----------------------------------------------------------

    const saveProduction = async () => {

        try {

            setLoading(true);

            const payload = {

                production,

                rm_items: rmItems,

                fg_items: fgItems

            };

            if (isEdit) {

                await updateProduction(

                    id,

                    payload

                );

            }

            else {

                await createProduction(

                    payload

                );

            }

            navigate("/productions");

        }

        catch (error) {

            console.error(error);

            alert(

                error.response?.data?.detail ||

                "Unable to save production."

            );

        }

        finally {

            setLoading(false);

        }

    };
        //----------------------------------------------------------
    // Loading
    //----------------------------------------------------------

    if (loading) {

        return (

            <Box
                display="flex"
                justifyContent="center"
                mt={5}
            >

                <CircularProgress />

            </Box>

        );

    }

    //----------------------------------------------------------
    // Screen
    //----------------------------------------------------------

    return (

        <Box p={3}>

            <Paper sx={{ p: 3 }}>

                <Typography
                    variant="h5"
                    gutterBottom
                >

                    {

                        isEdit

                            ? "Edit Production"

                            : "New Production"

                    }

                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Grid
                    container
                    spacing={2}
                >

                    <Grid size={{ xs: 12, md: 3 }}>

                        <TextField

                            fullWidth

                            label="Production No"

                            value={

                                production.production_no || ""

                            }

                            InputProps={{

                                readOnly: true

                            }}

                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>

                        <TextField

                            fullWidth

                            type="date"

                            label="Production Date"

                            name="production_date"

                            value={

                                production.production_date

                            }

                            onChange={

                                handleHeaderChange

                            }

                            InputLabelProps={{

                                shrink: true

                            }}

                        />

                    </Grid>

                    <Grid size={{ xs: 12, md: 3 }}>

                        <TextField

                            select

                            fullWidth

                            label="Status"

                            name="status"

                            value={

                                production.status

                            }

                            onChange={

                                handleHeaderChange

                            }

                        >

                            <MenuItem value="DRAFT">

                                Draft

                            </MenuItem>

                            <MenuItem value="COMPLETED">

                                Completed

                            </MenuItem>

                            <MenuItem value="CANCELLED">

                                Cancelled

                            </MenuItem>

                        </TextField>

                    </Grid>

                    <Grid size={{ xs: 12 }}>

                        <TextField

                            fullWidth

                            multiline

                            rows={2}

                            label="Remarks"

                            name="remarks"

                            value={

                                production.remarks

                            }

                            onChange={

                                handleHeaderChange

                            }

                        />

                    </Grid>

                </Grid>

                <Divider sx={{ mt: 4, mb: 3 }} />
                                {/*------------------------------------------------*/}
                {/* Raw Materials */}
                {/*------------------------------------------------*/}

                <Typography
                    variant="h6"
                    gutterBottom
                >

                    Raw Materials

                </Typography>

                <TableContainer
                    component={Paper}
                    variant="outlined"
                >

                    <Table>

                        <TableHead>

                            <TableRow>

                                <TableCell width="45%">

                                    Item

                                </TableCell>

                                <TableCell width="15%">

                                    Quantity

                                </TableCell>

                                <TableCell>

                                    Remarks

                                </TableCell>

                                <TableCell
                                    align="center"
                                    width="80"
                                >

                                    Action

                                </TableCell>

                            </TableRow>

                        </TableHead>

                        <TableBody>

                            {

                                rmItems.map(

                                    (

                                        row,

                                        index

                                    ) => (

                                        <TableRow key={index}>

                                            <TableCell>

                                                <TextField

                                                    select

                                                    fullWidth

                                                    size="small"

                                                    value={

                                                        row.item_id

                                                    }

                                                    onChange={(e) =>

                                                        handleRmChange(

                                                            index,

                                                            "item_id",

                                                            e.target.value

                                                        )

                                                    }

                                                >

                                                    {

                                                        rawMaterialItems.map(

                                                            item => (

                                                                <MenuItem

                                                                    key={

                                                                        item.item_id

                                                                    }

                                                                    value={

                                                                        item.item_id

                                                                    }

                                                                >

                                                                    {

                                                                        item.item_code

                                                                    }

                                                                    {" - "}

                                                                    {

                                                                        item.item_name

                                                                    }

                                                                </MenuItem>

                                                            )

                                                        )

                                                    }

                                                </TextField>

                                            </TableCell>

                                            <TableCell>

                                                <TextField

                                                    fullWidth

                                                    size="small"

                                                    type="number"

                                                    value={

                                                        row.quantity

                                                    }

                                                    onChange={(e) =>

                                                        handleRmChange(

                                                            index,

                                                            "quantity",

                                                            e.target.value

                                                        )

                                                    }

                                                />

                                            </TableCell>

                                            <TableCell>

                                                <TextField

                                                    fullWidth

                                                    size="small"

                                                    value={

                                                        row.remarks

                                                    }

                                                    onChange={(e) =>

                                                        handleRmChange(

                                                            index,

                                                            "remarks",

                                                            e.target.value

                                                        )

                                                    }

                                                />

                                            </TableCell>

                                            <TableCell
                                                align="center"
                                            >

                                                <IconButton
                                                    color="error"
                                                    onClick={() =>
                                                        deleteRmRow(index)
                                                    }
                                                >

                                                    <DeleteIcon />

                                                </IconButton>

                                            </TableCell>

                                        </TableRow>

                                    )

                                )

                            }

                        </TableBody>

                    </Table>

                </TableContainer>

                <Box
                    mt={2}
                    mb={4}
                >

                    <Button

                        variant="outlined"

                        startIcon={<AddIcon />}

                        onClick={addRmRow}

                    >

                        Add Raw Material

                    </Button>

                </Box>

                <Divider sx={{ mb: 3 }} />
                                {/*------------------------------------------------*/}
                {/* Finished Goods */}
                {/*------------------------------------------------*/}

                <Typography
                    variant="h6"
                    gutterBottom
                >

                    Finished Goods

                </Typography>

                <TableContainer
                    component={Paper}
                    variant="outlined"
                >

                    <Table>

                        <TableHead>

                            <TableRow>

                                <TableCell width="45%">

                                    Item

                                </TableCell>

                                <TableCell width="15%">

                                    Quantity

                                </TableCell>

                                <TableCell>

                                    Remarks

                                </TableCell>

                                <TableCell
                                    align="center"
                                    width="80"
                                >

                                    Action

                                </TableCell>

                            </TableRow>

                        </TableHead>

                        <TableBody>

                            {

                                fgItems.map(

                                    (

                                        row,

                                        index

                                    ) => (

                                        <TableRow key={index}>

                                            <TableCell>

                                                <TextField

                                                    select

                                                    fullWidth

                                                    size="small"

                                                    value={

                                                        row.item_id

                                                    }

                                                    onChange={(e) =>

                                                        handleFgChange(

                                                            index,

                                                            "item_id",

                                                            e.target.value

                                                        )

                                                    }

                                                >

                                                    {

                                                        finishedGoodsItems.map(

                                                            item => (

                                                                <MenuItem

                                                                    key={

                                                                        item.item_id

                                                                    }

                                                                    value={

                                                                        item.item_id

                                                                    }

                                                                >

                                                                    {

                                                                        item.item_code

                                                                    }

                                                                    {" - "}

                                                                    {

                                                                        item.item_name

                                                                    }

                                                                </MenuItem>

                                                            )

                                                        )

                                                    }

                                                </TextField>

                                            </TableCell>

                                            <TableCell>

                                                <TextField

                                                    fullWidth

                                                    size="small"

                                                    type="number"

                                                    value={

                                                        row.quantity

                                                    }

                                                    onChange={(e) =>

                                                        handleFgChange(

                                                            index,

                                                            "quantity",

                                                            e.target.value

                                                        )

                                                    }

                                                />

                                            </TableCell>

                                            <TableCell>

                                                <TextField

                                                    fullWidth

                                                    size="small"

                                                    value={

                                                        row.remarks

                                                    }

                                                    onChange={(e) =>

                                                        handleFgChange(

                                                            index,

                                                            "remarks",

                                                            e.target.value

                                                        )

                                                    }

                                                />

                                            </TableCell>

                                            <TableCell
                                                align="center"
                                            >

                                                <IconButton

                                                    color="error"

                                                    onClick={() =>

                                                        deleteFgRow(index)

                                                    }

                                                >

                                                    <DeleteIcon />

                                                </IconButton>

                                            </TableCell>

                                        </TableRow>

                                    )

                                )

                            }

                        </TableBody>

                    </Table>

                </TableContainer>

                <Box
                    mt={2}
                >

                    <Button

                        variant="outlined"

                        startIcon={<AddIcon />}

                        onClick={addFgRow}

                    >

                        Add Finished Good

                    </Button>

                </Box>

                <Divider sx={{ mt: 4, mb: 3 }} />

                <Stack

                    direction="row"

                    spacing={2}

                    justifyContent="flex-end"

                >

                    <Button

                        variant="outlined"

                        onClick={() =>

                            navigate("/productions")

                        }

                    >

                        Cancel

                    </Button>

                    <Button

                        variant="contained"

                        onClick={saveProduction}

                    >

                        Save

                    </Button>

                </Stack>

            </Paper>

        </Box>

    );

}

export default ProductionEntry;