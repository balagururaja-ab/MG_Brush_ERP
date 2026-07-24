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

    Card,

    CardContent,

    CircularProgress,

    Divider,

    Grid,

    Paper,

    Stack,

    Table,

    TableBody,

    TableCell,

    TableContainer,

    TableHead,

    TableRow,

    Typography

} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import EditIcon from "@mui/icons-material/Edit";

import {

    getProduction

} from "../../api/productionApi";

export default function ProductionView() {

    const navigate = useNavigate();

    const { id } = useParams();

    const [loading, setLoading] = useState(true);

    const [production, setProduction] = useState(null);

    useEffect(() => {

        loadProduction();

    }, []);

    const loadProduction = async () => {

        try {

            const data = await getProduction(id);

            setProduction(data);

        }

        catch (error) {

            console.error(error);

        }

        finally {

            setLoading(false);

        }

    };

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

    if (!production) {

        return (

            <Typography>

                Production not found.

            </Typography>

        );

    }
        return (

        <Box p={3}>

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

                    Production Details

                </Typography>

                <Stack

                    direction="row"

                    spacing={2}

                >

                    <Button

                        variant="outlined"

                        startIcon={<ArrowBackIcon />}

                        onClick={() =>

                            navigate("/productions")

                        }

                    >

                        Back

                    </Button>

                    <Button

                        variant="contained"

                        startIcon={<EditIcon />}

                        onClick={() =>

                            navigate(

                                `/productions/edit/${id}`

                            )

                        }

                    >

                        Edit

                    </Button>

                </Stack>

            </Stack>

            <Card>

                <CardContent>

                    <Grid

                        container

                        spacing={2}

                    >

                        <Grid size={{ xs: 12, md: 3 }}>

                            <Typography

                                color="text.secondary"

                            >

                                Production No

                            </Typography>

                            <Typography

                                fontWeight="bold"

                            >

                                {production.production_no}

                            </Typography>

                        </Grid>

                        <Grid size={{ xs: 12, md: 3 }}>

                            <Typography

                                color="text.secondary"

                            >

                                Production Date

                            </Typography>

                            <Typography>

                                {production.production_date}

                            </Typography>

                        </Grid>

                        <Grid size={{ xs: 12, md: 3 }}>

                            <Typography

                                color="text.secondary"

                            >

                                Status

                            </Typography>

                            <Typography>

                                {production.status}

                            </Typography>

                        </Grid>

                        <Grid size={{ xs: 12, md: 3 }}>

                            <Typography

                                color="text.secondary"

                            >

                                Remarks

                            </Typography>

                            <Typography>

                                {production.remarks || "-"}

                            </Typography>

                        </Grid>

                    </Grid>

                </CardContent>

            </Card>

            <Divider sx={{ my: 3 }} />
                        <Typography

                variant="h6"

                mb={2}

            >

                Raw Materials

            </Typography>

            <TableContainer

                component={Paper}

                sx={{ mb: 4 }}

            >

                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell>

                                S.No

                            </TableCell>

                            <TableCell>

                                Item Code

                            </TableCell>

                            <TableCell>

                                Item Name

                            </TableCell>

                            <TableCell align="right">

                                Quantity

                            </TableCell>

                            <TableCell>

                                Remarks

                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {production.rm_items?.map(

                            (item, index) => (

                                <TableRow

                                    key={item.production_rm_id}

                                >

                                    <TableCell>

                                        {index + 1}

                                    </TableCell>

                                    <TableCell>

                                        {item.item_code}

                                    </TableCell>

                                    <TableCell>

                                        {item.item_name}

                                    </TableCell>

                                    <TableCell align="right">

                                        {Number(

                                            item.quantity

                                        ).toFixed(3)}

                                    </TableCell>

                                    <TableCell>

                                        {item.remarks || "-"}

                                    </TableCell>

                                </TableRow>

                            )

                        )}

                    </TableBody>

                </Table>

            </TableContainer>

            <Divider sx={{ my: 3 }} />
                        <Typography

                variant="h6"

                mb={2}

            >

                Finished Goods

            </Typography>

            <TableContainer

                component={Paper}

            >

                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell>

                                S.No

                            </TableCell>

                            <TableCell>

                                Item Code

                            </TableCell>

                            <TableCell>

                                Item Name

                            </TableCell>

                            <TableCell align="right">

                                Quantity

                            </TableCell>

                            <TableCell>

                                Remarks

                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {production.fg_items?.map(

                            (item, index) => (

                                <TableRow

                                    key={item.production_fg_id}

                                >

                                    <TableCell>

                                        {index + 1}

                                    </TableCell>

                                    <TableCell>

                                        {item.item_code}

                                    </TableCell>

                                    <TableCell>

                                        {item.item_name}

                                    </TableCell>

                                    <TableCell align="right">

                                        {Number(

                                            item.quantity

                                        ).toFixed(3)}

                                    </TableCell>

                                    <TableCell>

                                        {item.remarks || "-"}

                                    </TableCell>

                                </TableRow>

                            )

                        )}

                    </TableBody>

                </Table>

            </TableContainer>

        </Box>

    );

}