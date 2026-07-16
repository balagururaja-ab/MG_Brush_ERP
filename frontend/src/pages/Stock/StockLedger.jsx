import {

    useEffect,

    useState

} from "react";

import {

    Paper,

    Typography,

    Table,

    TableBody,

    TableCell,

    TableContainer,

    TableHead,

    TableRow,

    Box,

    CircularProgress,

    Button,

    Stack,

    TextField,

    MenuItem,

    InputAdornment

} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

import RefreshIcon from "@mui/icons-material/Refresh";

import MainLayout from "../../layouts/MainLayout";

import {

    getStockLedger

} from "../../api/stockApi";

export default function StockLedger() {

    const [ledger, setLedger] = useState([]);

    const [filteredLedger, setFilteredLedger] = useState([]);

    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");

    const [transactionType, setTransactionType] = useState("ALL");

        const loadLedger = async () => {

        try {

            setLoading(true);

            const data = await getStockLedger();

            setLedger(data);

            setFilteredLedger(data);

        }

        catch (error) {

            console.error(error);

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadLedger();

    }, []);
        useEffect(() => {

        let rows = [...ledger];

        if (transactionType !== "ALL") {

            rows = rows.filter(

                (row) =>

                    row.transaction_type === transactionType

            );

        }

        if (search.trim() !== "") {

            const keyword = search.toLowerCase();

            rows = rows.filter(

                (row) =>

                    row.item_code
                        ?.toLowerCase()
                        .includes(keyword)

                    ||

                    row.item_name
                        ?.toLowerCase()
                        .includes(keyword)

                    ||

                    row.reference_no
                        ?.toLowerCase()
                        .includes(keyword)

            );

        }

        setFilteredLedger(rows);

    }, [

        search,

        transactionType,

        ledger

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

                        Stock Ledger

                    </Typography>

                    <Button

                        variant="contained"

                        startIcon={<RefreshIcon />}

                        onClick={loadLedger}

                    >

                        Refresh

                    </Button>

                </Stack>

                <Stack

                    direction="row"

                    spacing={2}

                    mb={3}

                >

                    <TextField

                        fullWidth

                        placeholder="Search Item / Reference No"

                        value={search}

                        onChange={(e) =>

                            setSearch(
                                e.target.value
                            )

                        }

                        InputProps={{

                            startAdornment: (

                                <InputAdornment position="start">

                                    <SearchIcon />

                                </InputAdornment>

                            )

                        }}

                    />

                    <TextField

                        select

                        sx={{
                            minWidth: 220
                        }}

                        label="Transaction"

                        value={transactionType}

                        onChange={(e) =>

                            setTransactionType(
                                e.target.value
                            )

                        }

                    >

                        <MenuItem value="ALL">

                            All

                        </MenuItem>

                        <MenuItem value="OPENING">

                            Opening

                        </MenuItem>

                        <MenuItem value="PURCHASE">

                            Purchase

                        </MenuItem>

                        <MenuItem value="PURCHASE_RETURN">

                            Purchase Return

                        </MenuItem>

                        <MenuItem value="SALES">

                            Sales

                        </MenuItem>

                        <MenuItem value="SALES_RETURN">

                            Sales Return

                        </MenuItem>

                        <MenuItem value="ADJUSTMENT">

                            Adjustment

                        </MenuItem>

                        <MenuItem value="TRANSFER">

                            Transfer

                        </MenuItem>

                    </TextField>

                </Stack>

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

                                            Date

                                        </TableCell>

                                        <TableCell>

                                            Transaction

                                        </TableCell>

                                        <TableCell>

                                            Reference No

                                        </TableCell>

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

                                            Qty In

                                        </TableCell>

                                        <TableCell
                                            align="right"
                                        >

                                            Qty Out

                                        </TableCell>

                                        <TableCell
                                            align="right"
                                        >

                                            Unit Cost

                                        </TableCell>

                                        <TableCell>

                                            Remarks

                                        </TableCell>

                                    </TableRow>

                                </TableHead>

                                <TableBody>
                                                                  {

                                    filteredLedger.length > 0 ?

                                    (

                                        filteredLedger.map((row) => (

                                            <TableRow
                                                key={row.stock_ledger_id}
                                                hover
                                            >

                                                <TableCell>

                                                    {

                                                        row.transaction_date

                                                        ?

                                                        new Date(

                                                            row.transaction_date

                                                        ).toLocaleString()

                                                        :

                                                        "-"

                                                    }

                                                </TableCell>

                                                <TableCell>

                                                    {row.transaction_type}

                                                </TableCell>

                                                <TableCell>

                                                    {row.reference_no}

                                                </TableCell>

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

                                                    {

                                                        Number(

                                                            row.qty_in

                                                        ).toFixed(3)

                                                    }

                                                </TableCell>

                                                <TableCell
                                                    align="right"
                                                >

                                                    {

                                                        Number(

                                                            row.qty_out

                                                        ).toFixed(3)

                                                    }

                                                </TableCell>

                                                <TableCell
                                                    align="right"
                                                >

                                                    ₹ {

                                                        Number(

                                                            row.unit_cost

                                                        ).toFixed(2)

                                                    }

                                                </TableCell>

                                                <TableCell>

                                                    {row.remarks}

                                                </TableCell>

                                            </TableRow>

                                        ))

                                    )

                                    :

                                    (

                                        <TableRow>

                                            <TableCell

                                                colSpan={10}

                                                align="center"

                                            >

                                                No Stock Transactions Found

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