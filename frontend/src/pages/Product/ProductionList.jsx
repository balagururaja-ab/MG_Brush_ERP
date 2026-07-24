import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {

    Container,

    Paper,

    Stack,

    Typography,

    Button,

    TextField,

    CircularProgress,

    Table,

    TableBody,

    TableCell,

    TableContainer,

    TableHead,

    TableRow,

    IconButton,

    Tooltip

} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import EditIcon from "@mui/icons-material/Edit";

import DeleteIcon from "@mui/icons-material/Delete";

import VisibilityIcon from "@mui/icons-material/Visibility";

import ConfirmDialog from "../../components/ConfirmDialog";

import {

    getProductions,

    deleteProduction

} from "../../api/productionApi";

import AppHeader from "../../components/AppHeader";


function ProductionList() {

    const navigate = useNavigate();

    //----------------------------------------------------------
    // State
    //----------------------------------------------------------

    const [

        productions,

        setProductions

    ] = useState([]);

    const [

        filteredProductions,

        setFilteredProductions

    ] = useState([]);

    const [

        loading,

        setLoading

    ] = useState(true);

    const [

        search,

        setSearch

    ] = useState("");

    const [

        deleteId,

        setDeleteId

    ] = useState(null);

    const [

        openDelete,

        setOpenDelete

    ] = useState(false);

    //----------------------------------------------------------
    // Load Productions
    //----------------------------------------------------------

    const loadProductions = async () => {

        try {

            setLoading(true);

            const data = await getProductions();

            setProductions(data);

            setFilteredProductions(data);

        }

        catch (error) {

            console.error(error);

            alert("Unable to load Production List.");

        }

        finally {

            setLoading(false);

        }

    };

    //----------------------------------------------------------
    // Initial Load
    //----------------------------------------------------------

    useEffect(() => {

        loadProductions();

    }, []);

    //----------------------------------------------------------
    // Search
    //----------------------------------------------------------

    useEffect(() => {

        if (search.trim() === "") {

            setFilteredProductions(

                productions

            );

            return;

        }

        const keyword = search.toLowerCase();

        const result = productions.filter(

            (row) =>

                row.production_no
                    ?.toLowerCase()
                    .includes(keyword)

                ||

                row.status
                    ?.toLowerCase()
                    .includes(keyword)

                ||

                row.remarks
                    ?.toLowerCase()
                    .includes(keyword)

        );

        setFilteredProductions(

            result

        );

    }, [

        search,

        productions

    ]);

    //----------------------------------------------------------
    // Navigation
    //----------------------------------------------------------

    const handleAdd = () => {

        navigate(

            "/productions/new"

        );

    };

    const handleEdit = (

        id

    ) => {

        navigate(

            `/productions/edit/${id}`

        );

    };

    const handleView = (

        id

    ) => {

        navigate(

            `/productions/view/${id}`

        );

    };

    //----------------------------------------------------------
    // Delete
    //----------------------------------------------------------

    const handleDelete = (

        id

    ) => {

        setDeleteId(id);

        setOpenDelete(true);

    };

    const confirmDelete = async () => {

        try {

            await deleteProduction(

                deleteId

            );

            setOpenDelete(false);

            setDeleteId(null);

            loadProductions();

        }

        catch (error) {

            console.error(error);

            alert(

                "Unable to delete Production."

            );

        }

    };
        //----------------------------------------------------------
    // Loading
    //----------------------------------------------------------

    if (loading) {

        return (

            <Container sx={{ mt: 5, textAlign: "center" }}>

                <CircularProgress />

            </Container>

        );

    }

    //----------------------------------------------------------
    // UI
    //----------------------------------------------------------

    return (

        <>
        <AppHeader />
        
        <Container maxWidth="xl">

            <Paper
                sx={{
                    mt: 2,
                    p: 3
                }}
            >

                <Stack

                    direction="row"

                    justifyContent="space-between"

                    alignItems="center"

                    mb={3}

                >

                    <Typography variant="h5">

                        Production List

                    </Typography>

                    <Button

                        variant="contained"

                        startIcon={<AddIcon />}

                        onClick={handleAdd}

                    >

                        New Production

                    </Button>

                </Stack>

                <TextField

                    fullWidth

                    label="Search"

                    placeholder="Production No / Status / Remarks"

                    value={search}

                    onChange={(e) =>

                        setSearch(

                            e.target.value

                        )

                    }

                    sx={{ mb: 3 }}

                />

                <TableContainer>

                    <Table>

                        <TableHead>

                            <TableRow>

                                <TableCell>

                                    Production No

                                </TableCell>

                                <TableCell>

                                    Date

                                </TableCell>

                                <TableCell>

                                    Status

                                </TableCell>

                                <TableCell>

                                    Remarks

                                </TableCell>

                                <TableCell align="center">

                                    Actions

                                </TableCell>

                            </TableRow>

                        </TableHead>

                        <TableBody>

                            {

                                filteredProductions.length === 0

                                ?

                                (

                                    <TableRow>

                                        <TableCell

                                            colSpan={5}

                                            align="center"

                                        >

                                            No Production Records Found

                                        </TableCell>

                                    </TableRow>

                                )

                                :

                                (

                                    filteredProductions.map(

                                        (row) => (

                                            <TableRow

                                                key={

                                                    row.production_id

                                                }

                                            >

                                                <TableCell>

                                                    {

                                                        row.production_no

                                                    }

                                                </TableCell>

                                                <TableCell>

                                                    {

                                                        row.production_date

                                                    }

                                                </TableCell>

                                                <TableCell>

                                                    {

                                                        row.status

                                                    }

                                                </TableCell>

                                                <TableCell>

                                                    {

                                                        row.remarks

                                                    }

                                                </TableCell>

                                                <TableCell

                                                    align="center"

                                                >

                                                    <Tooltip title="View">

                                                        <IconButton

                                                            color="primary"

                                                            onClick={() =>

                                                                handleView(

                                                                    row.production_id

                                                                )

                                                            }

                                                        >

                                                            <VisibilityIcon />

                                                        </IconButton>

                                                    </Tooltip>

                                                    <Tooltip title="Edit">

                                                        <IconButton

                                                            color="secondary"

                                                            onClick={() =>

                                                                handleEdit(

                                                                    row.production_id

                                                                )

                                                            }

                                                        >

                                                            <EditIcon />

                                                        </IconButton>

                                                    </Tooltip>

                                                    <Tooltip title="Delete">

                                                        <IconButton

                                                            color="error"

                                                            onClick={() =>

                                                                handleDelete(

                                                                    row.production_id

                                                                )

                                                            }

                                                        >

                                                            <DeleteIcon />

                                                        </IconButton>

                                                    </Tooltip>

                                                </TableCell>

                                            </TableRow>

                                        )

                                    )

                                )

                            }

                        </TableBody>

                    </Table>

                </TableContainer>
                                <ConfirmDialog

                    open={openDelete}

                    title="Delete Production"

                    message="Are you sure you want to delete this production record?"

                    onConfirm={confirmDelete}

                    onCancel={() => {

                        setOpenDelete(false);

                        setDeleteId(null);

                    }}

                />

            </Paper>

        </Container>
      </>
    
    );


}

export default ProductionList;