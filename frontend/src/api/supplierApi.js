import apiClient from "./apiClient";

// ---------------------------------------------------------
// Get All Suppliers
// ---------------------------------------------------------

export const getSuppliers = async () => {

    const response = await apiClient.get(
        "/suppliers"
    );

    return response.data;

};

// ---------------------------------------------------------
// Get Supplier By Id
// ---------------------------------------------------------

export const getSupplier = async (
    supplierId
) => {

    const response = await apiClient.get(
        `/suppliers/${supplierId}`
    );

    return response.data;

};

// ---------------------------------------------------------
// Create Supplier
// ---------------------------------------------------------

export const createSupplier = async (
    supplier
) => {

    const response = await apiClient.post(
        "/suppliers",
        supplier
    );

    return response.data;

};

// ---------------------------------------------------------
// Update Supplier
// ---------------------------------------------------------

export const updateSupplier = async (
    supplierId,
    supplier
) => {

    const response = await apiClient.put(
        `/suppliers/${supplierId}`,
        supplier
    );

    return response.data;

};

// ---------------------------------------------------------
// Delete Supplier
// ---------------------------------------------------------

export const deleteSupplier = async (
    supplierId
) => {

    const response = await apiClient.delete(
        `/suppliers/${supplierId}`
    );

    return response.data;

};