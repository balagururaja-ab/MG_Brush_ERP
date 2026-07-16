import apiClient from "./apiClient";

//---------------------------------------------------------
// Get All Sales
//---------------------------------------------------------

export const getSales = async () => {

    const response = await apiClient.get(
        "/sales"
    );

    return response.data;

};

//---------------------------------------------------------
// Get Sales By Id
//---------------------------------------------------------

export const getSale = async (
    salesId
) => {

    const response = await apiClient.get(
        `/sales/${salesId}`
    );

    return response.data;

};

//---------------------------------------------------------
// Create Sales
//---------------------------------------------------------

export const createSales = async (
    sales
) => {

    const response = await apiClient.post(
        "/sales",
        sales
    );

    return response.data;

};

//---------------------------------------------------------
// Update Sales
//---------------------------------------------------------

export const updateSales = async (
    salesId,
    sales
) => {

    const response = await apiClient.put(
        `/sales/${salesId}`,
        sales
    );

    return response.data;

};

//---------------------------------------------------------
// Delete Sales
//---------------------------------------------------------

export const deleteSales = async (
    salesId
) => {

    const response = await apiClient.delete(
        `/sales/${salesId}`
    );

    return response.data;

};