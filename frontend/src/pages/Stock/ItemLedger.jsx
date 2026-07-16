import {

    useEffect,

    useState

} from "react";

import {

    useParams,

    useNavigate

} from "react-router-dom";

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

    Button,

    Box,

    Stack

} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import RefreshIcon from "@mui/icons-material/Refresh";

import MainLayout from "../../layouts/MainLayout";

import {

    getItemStockLedger

} from "../../api/stockApi";

export default function ItemLedger() {

    const { itemId } = useParams();

    const navigate = useNavigate();

    const [ledger, setLedger] = useState([]);

    const [loading, setLoading] = useState(false);

    const [itemName, setItemName] = useState("");

    const [itemCode, setItemCode] = useState("");

        const loadLedger = async () => {

        try {

            setLoading(true);

            const data = await getItemStockLedger(

                itemId

            );

            setLedger(data);

            if (data.length > 0) {

                setItemName(

                    data[0].item_name

                );

                setItemCode(

                    data[0].item_code

                );

            }

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

    }, [itemId]);
    let runningBalance = 0;
        return (

        <MainLayout>

            <Paper
                elevation={3}
                sx={{ p: 3 }}
            >

                <Stack

                    direction="row"

                    justifyContent="space-between"

                    alignItems="center"

                    mb={3}

                >

                    <Box>

                        <Typography
                            variant="h5"
                            fontWeight="bold"
                        >

                            Item Stock Ledger

                        </Typography>

                        <Typography
                            variant="subtitle1"
                            color="text.secondary"
                        >

                            {itemCode} - {itemName}

                        </Typography>

                    </Box>

                    <Stack
                        direction="row"
                        spacing={2}
                    >

                        <Button

                            variant="outlined"

                            startIcon={<ArrowBackIcon />}

                            onClick={() =>
                                navigate("/stock")
                            }

                        >

                            Back

                        </Button>

                        <Button

                            variant="contained"

                            startIcon={<RefreshIcon />}

                            onClick={loadLedger}

                        >

                            Refresh

                        </Button>

                    </Stack>

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

                                            Balance

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

                                        ledger.length > 0 ?

                                        (

                                            ledger.map((row) => {

                                                runningBalance +=

                                                    Number(row.qty_in)

                                                    -

                                                    Number(row.qty_out);

                                                return (

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

                                                            {

                                                                row.transaction_type

                                                            }

                                                        </TableCell>

                                                        <TableCell>

                                                            {

                                                                row.reference_no

                                                            }

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

                                                            <strong>

                                                                {

                                                                    runningBalance.toFixed(3)

                                                                }

                                                            </strong>

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

                                                            {

                                                                row.remarks

                                                            }

                                                        </TableCell>

                                                    </TableRow>

                                                );

                                            })

                                        )

                                        :

                                        (

                                            <TableRow>

                                                <TableCell

                                                    colSpan={8}

                                                    align="center"

                                                >

                                                    No Ledger Found

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