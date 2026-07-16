import {

    useEffect,

    useState

} from "react";

import {

    Paper,

    Typography,

    Table,

    TableHead,

    TableBody,

    TableRow,

    TableCell,

    TableContainer,

    CircularProgress,

    Box,

    Button,

    Stack,

    TextField,

    InputAdornment

} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

import RefreshIcon from "@mui/icons-material/Refresh";

import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import MainLayout from "../../layouts/MainLayout";

import {

    getLowStock

} from "../../api/stockApi";

export default function LowStock() {

    const [stocks, setStocks] = useState([]);

    const [filteredStocks, setFilteredStocks] = useState([]);

    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");

        const loadStocks = async () => {

        try {

            setLoading(true);

            const data = await getLowStock();

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

                (row) =>

                    row.item_code
                        ?.toLowerCase()
                        .includes(keyword)

                    ||

                    row.item_name
                        ?.toLowerCase()
                        .includes(keyword)

            )

        );

    }, [

        search,

        stocks

    ]);

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

                        Low Stock Report

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

                    placeholder="Search Item"

                    value={search}

                    onChange={(e) =>

                        setSearch(

                            e.target.value

                        )

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

                        <TableContainer component={Paper}>

                            <Table>

                                <TableHead>

                                    <TableRow>

                                        <TableCell>

                                            Item Code

                                        </TableCell>

                                        <TableCell>

                                            Item Name

                                        </TableCell>

                                        <TableCell align="right">

                                            Current Qty

                                        </TableCell>

                                        <TableCell align="right">

                                            Reorder Level

                                        </TableCell>

                                        <TableCell align="center">

                                            Status

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

                                                <TableCell

                                                    align="right"

                                                >

                                                    {

                                                        Number(

                                                            row.current_qty

                                                        ).toFixed(3)

                                                    }

                                                </TableCell>

                                                <TableCell

                                                    align="right"

                                                >

                                                    {

                                                        Number(

                                                            row.reorder_level

                                                        ).toFixed(3)

                                                    }

                                                </TableCell>

                                                <TableCell

                                                    align="center"

                                                >

                                                    <Stack

                                                        direction="row"

                                                        spacing={1}

                                                        justifyContent="center"

                                                        alignItems="center"

                                                    >

                                                        <WarningAmberIcon

                                                            color="warning"

                                                        />

                                                        <Typography

                                                            color="error"

                                                            fontWeight="bold"

                                                        >

                                                            LOW STOCK

                                                        </Typography>

                                                    </Stack>

                                                </TableCell>

                                            </TableRow>

                                        ))

                                    )

                                    :

                                    (

                                        <TableRow>

                                            <TableCell

                                                colSpan={5}

                                                align="center"

                                            >

                                                No Low Stock Items Found

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