import {

    useEffect,

    useState

} from "react";

import {

    Box,

    Paper,

    Typography,

    Table,

    TableHead,

    TableBody,

    TableRow,

    TableCell,

    TableContainer,

    CircularProgress,

    Button,

    Stack,

    TextField,

    InputAdornment

} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

import RefreshIcon from "@mui/icons-material/Refresh";

import VisibilityIcon from "@mui/icons-material/Visibility";

import {

    useNavigate

} from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";

import {

    getStockSummary

} from "../../api/stockApi";

export default function StockSummary() {

    const navigate = useNavigate();

    const [stocks, setStocks] = useState([]);

    const [filteredStocks, setFilteredStocks] = useState([]);

    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");

        const loadStocks = async () => {

        try {

            setLoading(true);

            const data = await getStockSummary();

            setStocks(data);

            setFilteredStocks(data);

        }

        catch (error) {

            console.error(error);

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadStocks();

    }, []);
        useEffect(() => {

        if (search.trim() === "") {

            setFilteredStocks(stocks);

            return;

        }

        const keyword = search.toLowerCase();

        setFilteredStocks(

            stocks.filter(

                (item) =>

                    item.item_code
                        ?.toLowerCase()
                        .includes(keyword)

                    ||

                    item.item_name
                        ?.toLowerCase()
                        .includes(keyword)

                    ||

                    item.warehouse
                        ?.toLowerCase()
                        .includes(keyword)

            )

        );

    }, [search, stocks]);
        return (

        <MainLayout>

            <Paper
                elevation={3}
                sx={{
                    p: 3
                }}
            >

                <Stack

                    direction="row"

                    justifyContent="space-between"

                    alignItems="center"

                    mb={3}

                >

                    <Typography

                        variant="h5"

                        fontWeight="bold"

                    >

                        Stock Summary

                    </Typography>

                    <Button

                        variant="contained"

                        startIcon={<RefreshIcon />}

                        onClick={loadStocks}

                    >

                        Refresh

                    </Button>

                </Stack>

                <TextField

                    fullWidth

                    placeholder="Search Item Code / Item Name / Warehouse"

                    value={search}

                    onChange={(e) =>
                        setSearch(e.target.value)
                    }

                    sx={{
                        mb: 3
                    }}

                    InputProps={{

                        startAdornment: (

                            <InputAdornment position="start">

                                <SearchIcon />

                            </InputAdornment>

                        )

                    }}

                />

                {

                    loading ?

                    (

                        <Box

                            display="flex"

                            justifyContent="center"

                            mt={5}

                            mb={5}

                        >

                            <CircularProgress />

                        </Box>

                    )

                    :

                    (

                        <TableContainer
                            component={Paper}
                        >

                            <Table>

                                <TableHead>

                                    <TableRow>

                                        <TableCell>

                                            Item Code

                                        </TableCell>

                                        <TableCell>

                                            Item Name

                                        </TableCell>

                                        <TableCell>

                                            Warehouse

                                        </TableCell>

                                        <TableCell
                                            align="right"
                                        >

                                            Current Qty

                                        </TableCell>

                                        <TableCell
                                            align="right"
                                        >

                                            Average Cost

                                        </TableCell>

                                        <TableCell
                                            align="right"
                                        >

                                            Last Purchase Cost

                                        </TableCell>

                                        <TableCell
                                            align="right"
                                        >

                                            Inventory Value

                                        </TableCell>

                                        <TableCell>

                                            Updated

                                        </TableCell>

                                        <TableCell
                                            align="center"
                                        >

                                            Action

                                        </TableCell>

                                    </TableRow>

                                </TableHead>

                                <TableBody>
                                {

                                    filteredStocks.length > 0 ?

                                    (

                                        filteredStocks.map((row) => (

                                            <TableRow
                                                key={row.item_id}
                                                hover
                                            >

                                                <TableCell>

                                                    {row.item_code}

                                                </TableCell>

                                                <TableCell>

                                                    {row.item_name}

                                                </TableCell>

                                                <TableCell>

                                                    {row.warehouse}

                                                </TableCell>

                                                <TableCell
                                                    align="right"
                                                >

                                                    {Number(
                                                        row.current_qty
                                                    ).toFixed(3)}

                                                </TableCell>

                                                <TableCell
                                                    align="right"
                                                >

                                                    ₹ {Number(
                                                        row.average_cost
                                                    ).toFixed(2)}

                                                </TableCell>

                                                <TableCell
                                                    align="right"
                                                >

                                                    ₹ {Number(
                                                        row.last_purchase_cost
                                                    ).toFixed(2)}

                                                </TableCell>

                                                <TableCell
                                                    align="right"
                                                >

                                                    ₹ {

                                                        (

                                                            Number(
                                                                row.current_qty
                                                            )

                                                            *

                                                            Number(
                                                                row.average_cost
                                                            )

                                                        ).toFixed(2)

                                                    }

                                                </TableCell>

                                                <TableCell>

                                                    {

                                                        row.updated_at ?

                                                        new Date(

                                                            row.updated_at

                                                        ).toLocaleString()

                                                        :

                                                        "-"

                                                    }

                                                </TableCell>

                                                <TableCell
                                                    align="center"
                                                >

                                                    <Button

                                                        size="small"

                                                        variant="outlined"

                                                        startIcon={

                                                            <VisibilityIcon />

                                                        }

                                                        onClick={() =>

                                                            navigate(

                                                                `/stock/item/${row.item_id}`

                                                            )

                                                        }

                                                    >

                                                        Ledger

                                                    </Button>

                                                </TableCell>

                                            </TableRow>

                                        ))

                                    )

                                    :

                                    (

                                        <TableRow>

                                            <TableCell

                                                colSpan={9}

                                                align="center"

                                            >

                                                No Stock Records Found

                                            </TableCell>

                                        </TableRow>

                                    )

                                }

                            </TableBody>

                        </Table>

                    </TableContainer>

                )

                }

            </Paper>

        </MainLayout>

    );

}