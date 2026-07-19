import { useEffect, useState } from "react";

import {

    Box,

    Paper,

    Grid,

    TextField,

    Typography,

    MenuItem,

    Button,

    Divider

} from "@mui/material";

import {

    Add,

    Save,

    ArrowBack

} from "@mui/icons-material";

import {

    useNavigate,

    useParams

} from "react-router-dom";

import {

    createOrder,

    updateOrder,

    getOrder

} from "../../api/orderApi";

import {

    getCustomers

} from "../../api/customerApi";

import {
    getBrands,
    getBrushSizes
} from "../../api/itemApi";

import AppHeader from "../../components/AppHeader";

const emptyOrder = {

    customer_id: "",

    order_date: new Date()

        .toISOString()

        .split("T")[0],

    expected_delivery: "",

    status: "DRAFT",

    remarks: ""

};

const emptyItem = {

    brand_id: "",

    brush_size_id: "",

    quantity: 1,

    rate: 0,

    amount: 0

};

export default function OrderEntry() {

    const navigate = useNavigate();

    const { id } = useParams();

    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(false);

    const [customers, setCustomers] = useState([]);

    const [brushSizes, setBrushSizes] = useState([]);

    const [brands, setBrands] = useState([]);

    const [order, setOrder] = useState(

        emptyOrder

    );
    
    const [items, setItems] = useState([
        { ...emptyItem }
    ]);

    //---------------------------------------------------------
    // Load Customers
    //---------------------------------------------------------

    const loadCustomers = async () => {

        try {

            const data = await getCustomers();

            setCustomers(data);

        }

        catch (err) {

            console.error(err);

        }

    };

    //---------------------------------------------------------
    // Load Items
    //---------------------------------------------------------

    const loadItems = async () => {

        try {

            const data = await getItems();

            setItemsMaster(data);

        }

        catch (err) {

            console.error(err);

        }

    };

    //---------------------------------------------------------
    // Load Existing Order
    //---------------------------------------------------------

    const loadOrder = async () => {

        if (!isEdit) {

            return;

        }

        try {

            setLoading(true);

            const data = await getOrder(id);

            setOrder(data.order);

            setItems(data.items);

        }

        catch (err) {

            console.error(err);

            alert(

                "Unable to load order."

            );

        }

        finally {

            setLoading(false);

        }

    };

    //---------------------------------------------------------
    // Initial Load
    //---------------------------------------------------------

    useEffect(() => {

        loadCustomers();

        loadBrands();

        loadBrushSizes();

        loadOrder();

    }, []);
        //---------------------------------------------------------
    // Header Change
    //---------------------------------------------------------

    const handleHeaderChange = (e) => {

        setOrder({

            ...order,

            [e.target.name]: e.target.value

        });

    };

    //---------------------------------------------------------
    // Add Item Row
    //---------------------------------------------------------

    const handleAddRow = () => {

        setItems([

            ...items,

            {

                ...emptyItem

            }

        ]);

    };

    //---------------------------------------------------------
    // Delete Item Row
    //---------------------------------------------------------

    const handleDeleteRow = (index) => {

        if (items.length === 1) {

            alert(

                "At least one item is required."

            );

            return;

        }

        const updated = [...items];

        updated.splice(index, 1);

        setItems(updated);

    };

    //---------------------------------------------------------
    // Item Change
    //---------------------------------------------------------

    const handleItemChange = (

        index,

        field,

        value

    ) => {

        const updated = [...items];

        updated[index][field] = value;

        //-----------------------------------------------------
        // Auto Fill Selling Rate
        //-----------------------------------------------------

        if (

            field === "item_id"

        ) {

            const selected = itemsMaster.find(

                (item) =>

                    Number(item.item_id) ===

                    Number(value)

            );            

        }

        //-----------------------------------------------------
        // Calculate Line Amount
        //-----------------------------------------------------

        const qty =

            Number(

                updated[index].quantity

            ) || 0;

        const rate =

            Number(

                updated[index].rate

            ) || 0;

        updated[index].amount =

            Number(

                (

                    qty * rate

                ).toFixed(2)

            );

        setItems(updated);

    };

    //---------------------------------------------------------
    // Grand Total
    //---------------------------------------------------------

    const grandTotal = items.reduce(

        (

            total,

            item

        ) =>

            total +

            Number(

                item.amount || 0

            ),

        0

    );
    const loadBrands = async () => {

        try {

            const data = await getBrands();

            setBrands(data);

        }
        catch(err){

            console.error(err);

        }

    };


    const loadBrushSizes = async () => {

        try {

            const data = await getBrushSizes();

            setBrushSizes(data);

        }
        catch(err){

            console.error(err);

        }

    };
    
    //---------------------------------------------------------
    // UI
    //---------------------------------------------------------

    return (

        <>
        <AppHeader />

        
        <Box sx={{ p: 3 }}>

            <Paper sx={{ p: 3 }}>

                <Box

                    display="flex"

                    justifyContent="space-between"

                    alignItems="center"

                    mb={3}

                >

                    <Typography

                        variant="h5"

                        fontWeight="bold"

                    >

                        {

                            isEdit

                                ? "Edit Customer Order"

                                : "New Customer Order"

                        }

                    </Typography>

                    <Button

                        variant="outlined"

                        startIcon={<ArrowBack />}

                        onClick={() =>

                            navigate("/orders")

                        }

                    >

                        Back

                    </Button>

                </Box>

                <Divider sx={{ mb: 3 }} />

                <Grid

                    container

                    spacing={2}

                >

                    <Grid item xs={12} md={6}>

                        <TextField

                            select

                            fullWidth

                            required

                            label="Customer"

                            name="customer_id"

                            value={order.customer_id}

                            onChange={handleHeaderChange}

                        >

                            {

                                customers.map(

                                    (customer) => (

                                        <MenuItem

                                            key={customer.customer_id}

                                            value={customer.customer_id}

                                        >

                                            {

                                                customer.customer_name

                                            }

                                        </MenuItem>

                                    )

                                )

                            }

                        </TextField>

                    </Grid>

                    <Grid item xs={12} md={3}>

                        <TextField

                            fullWidth

                            required

                            type="date"

                            label="Order Date"

                            name="order_date"

                            value={order.order_date}

                            onChange={handleHeaderChange}

                            InputLabelProps={{

                                shrink: true

                            }}

                        />

                    </Grid>

                    <Grid item xs={12} md={3}>

                        <TextField

                            fullWidth

                            type="date"

                            label="Expected Delivery"

                            name="expected_delivery"

                            value={

                                order.expected_delivery

                            }

                            onChange={handleHeaderChange}

                            InputLabelProps={{

                                shrink: true

                            }}

                        />

                    </Grid>

                    <Grid item xs={12} md={4}>

                        <TextField

                            select

                            fullWidth

                            label="Status"

                            name="status"

                            value={order.status}

                            onChange={handleHeaderChange}

                        >

                            <MenuItem value="DRAFT">

                                DRAFT

                            </MenuItem>

                            <MenuItem value="CONFIRMED">

                                CONFIRMED

                            </MenuItem>

                            <MenuItem value="INVOICED">

                                INVOICED

                            </MenuItem>

                            <MenuItem value="CANCELLED">

                                CANCELLED

                            </MenuItem>

                        </TextField>

                    </Grid>

                    <Grid item xs={12} md={8}>

                        <TextField

                            fullWidth

                            label="Remarks"

                            name="remarks"

                            value={order.remarks}

                            onChange={handleHeaderChange}

                        />

                    </Grid>

                </Grid>

                <Divider sx={{ my: 4 }} />

                <Typography

                    variant="h6"

                    gutterBottom

                >

                    Order Items

                </Typography>
                                {

                    items.map(

                        (

                            item,

                            index

                        ) => (

                            <Grid

                                container

                                spacing={2}

                                key={index}

                                sx={{

                                    mb: 2

                                }}

                            >

                                <Grid

                                    item

                                    xs={12}

                                    md={3}

                                >

                                    <TextField

                                        select

                                        fullWidth

                                        label="Brand"

                                        value={

                                            item.brand_id

                                        }

                                        onChange={(e) =>

                                            handleItemChange(

                                                index,

                                                "brand_id",

                                                e.target.value

                                            )

                                        }

                                    >

                                        {

                                            brands.map(

                                                (

                                                    brand

                                                ) => (

                                                    <MenuItem

                                                        key={

                                                            brand.brand_id

                                                        }

                                                        value={

                                                            brand.brand_id

                                                        }

                                                    >

                                                        {

                                                            brand.brand_name

                                                        }

                                                    </MenuItem>

                                                )

                                            )

                                        }

                                    </TextField>

                                </Grid>

                                <Grid item xs={12} md={3}>

                                    <TextField
                                        select
                                        fullWidth
                                        label="Brush Size"
                                        value={item.brush_size_id}
                                        onChange={(e)=>
                                            handleItemChange(
                                                index,
                                                "brush_size_id",
                                                e.target.value
                                            )
                                        }
                                    >

                                    {
                                    brushSizes.map((size)=>(
                                    <MenuItem
                                        key={size.brush_size_id}
                                        value={size.brush_size_id}
                                    >
                                        {size.size_name}
                                    </MenuItem>
                                    ))
                                    }

                                    </TextField>

                                    </Grid>

                                <Grid

                                    item

                                    xs={12}

                                    md={1}

                                >

                                    <TextField

                                        fullWidth

                                        type="number"

                                        label="Quantity"

                                        value={

                                            item.quantity

                                        }

                                        onChange={(e) =>

                                            handleItemChange(

                                                index,

                                                "quantity",

                                                e.target.value

                                            )

                                        }

                                    />

                                </Grid>

                                <Grid

                                    item

                                    xs={12}

                                    md={2}

                                >

                                    <TextField

                                        fullWidth

                                        type="number"

                                        label="Rate"

                                        value={

                                            item.rate

                                        }

                                        onChange={(e) =>

                                            handleItemChange(

                                                index,

                                                "rate",

                                                e.target.value

                                            )

                                        }

                                    />

                                </Grid>

                                <Grid

                                    item

                                    xs={12}

                                    md={2}

                                >

                                    <TextField

                                        fullWidth

                                        label="Amount"

                                        value={

                                            Number(

                                                item.amount || 0

                                            ).toFixed(2)

                                        }

                                        InputProps={{

                                            readOnly: true

                                        }}

                                    />

                                </Grid>

                                <Grid

                                    item

                                    xs={12}

                                    md={1}

                                    display="flex"

                                    alignItems="center"

                                    gap={1}

                                >

                                    <Button

                                        variant="contained"

                                        color="success"

                                        onClick={

                                            handleAddRow

                                        }

                                    >

                                        <Add />

                                    </Button>

                                    <Button

                                        variant="contained"

                                        color="error"

                                        onClick={() =>

                                            handleDeleteRow(

                                                index

                                            )

                                        }

                                    >

                                        X

                                    </Button>

                                </Grid>

                            </Grid>

                        )

                    )

                }

                <Divider sx={{ my: 3 }} />
                                <Box

                    display="flex"

                    justifyContent="flex-end"

                    mt={3}

                    mb={4}

                >

                    <Typography

                        variant="h5"

                        fontWeight="bold"

                    >

                        Grand Total :

                        ₹ {grandTotal.toFixed(2)}

                    </Typography>

                </Box>

                <Divider sx={{ mb: 3 }} />

                <Box

                    display="flex"

                    justifyContent="space-between"

                >

                    <Button

                        variant="outlined"

                        startIcon={<ArrowBack />}

                        onClick={() =>

                            navigate("/orders")

                        }

                    >

                        Cancel

                    </Button>

                    <Button

                        variant="contained"

                        startIcon={<Save />}

                        disabled={loading}

                        onClick={async () => {

                            if (!order.customer_id) {

                                alert(

                                    "Please select customer."

                                );

                                return;

                            }

                            if (

                                items.length === 0

                            ) {

                                alert(

                                    "Please add at least one item."

                                );

                                return;

                            }

                            for (

                                const row of items

                            ) {

                                if(!row.brand_id)
                                    {
                                        alert("Please select brand.");
                                        return;
                                    }

                                    if(!row.brush_size_id)
                                    {
                                        alert("Please select brush size.");
                                        return;
                                    }

                                if (

                                    Number(

                                        row.quantity

                                    ) <= 0

                                ) {

                                    alert(

                                        "Quantity should be greater than zero."

                                    );

                                    return;

                                }

                                if (

                                    Number(

                                        row.rate

                                    ) <= 0

                                ) {

                                    alert(

                                        "Rate should be greater than zero."

                                    );

                                    return;

                                }

                            }

                            try {

                                setLoading(true);

                                if (

                                    isEdit

                                ) {

                                    await updateOrder(

                                        id,

                                        order,

                                        items

                                    );

                                }

                                else {

                                    await createOrder(

                                        order,
                                        items

                                    );

                                }

                                alert(

                                    isEdit

                                        ? "Order updated successfully."

                                        : "Order created successfully."

                                );

                                navigate(

                                    "/orders"

                                );

                            }

                            catch (

                                err

                            ) {

                                console.error(

                                    err

                                );

                                alert(

                                    "Unable to save order."

                                );

                            }

                            finally {

                                setLoading(

                                    false

                                );

                            }

                        }}

                    >

                        {

                            loading

                                ? "Saving..."

                                : isEdit

                                    ? "Update Order"

                                    : "Save Order"

                        }

                    </Button>

                </Box>
                            </Paper>

        </Box>
    </>

    );

}