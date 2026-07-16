import axios from "axios";

const API = "http://127.0.0.1:8000/api/stock";

// -----------------------------------------------------
// Stock Summary
// -----------------------------------------------------

export const getStockSummary = async () => {

    const response = await axios.get(
        `${API}/summary`
    );

    return response.data;
};


// -----------------------------------------------------
// Complete Stock Ledger
// -----------------------------------------------------

export const getStockLedger = async () => {

    const response = await axios.get(
        `${API}/ledger`
    );

    return response.data;
};


// -----------------------------------------------------
// Item Stock Ledger
// -----------------------------------------------------

export const getItemStockLedger = async (
    itemId
) => {

    const response = await axios.get(
        `${API}/items/${itemId}`
    );

    return response.data;
};


// -----------------------------------------------------
// Current Stock Balance
// -----------------------------------------------------

export const getCurrentStock = async (
    itemId
) => {

    const response = await axios.get(
        `${API}/balance/${itemId}`
    );

    return response.data;
};


// -----------------------------------------------------
// Low Stock
// -----------------------------------------------------

export const getLowStock = async () => {

    const response = await axios.get(
        `${API}/low-stock`
    );

    return response.data;
};


// -----------------------------------------------------
// Opening Stock
// -----------------------------------------------------

export const saveOpeningStock = async (
    payload
) => {

    const response = await axios.post(
        `${API}/opening`,
        payload
    );

    return response.data;
};