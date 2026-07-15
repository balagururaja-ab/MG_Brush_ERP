import apiClient from "./apiClient";

//--------------------------------------
// Get All Customers
//--------------------------------------

export const getCustomers = async () => {

    const response = await apiClient.get(
        "/customers"
    );

    return response.data;

};

//--------------------------------------
// Get Customer
//--------------------------------------

export const getCustomer = async (
    customerId
) => {

    const response = await apiClient.get(
        `/customers/${customerId}`
    );

    return response.data;

};

//--------------------------------------
// Create Customer
//--------------------------------------

export const createCustomer = async (
    customer
) => {

    const response = await apiClient.post(
        "/customers",
        customer
    );

    return response.data;

};

//--------------------------------------
// Update Customer
//--------------------------------------

export const updateCustomer = async (
    customerId,
    customer
) => {

    const response = await apiClient.put(
        `/customers/${customerId}`,
        customer
    );

    return response.data;

};

//--------------------------------------
// Delete Customer
//--------------------------------------

export const deleteCustomer = async (
    customerId
) => {

    const response = await apiClient.delete(
        `/customers/${customerId}`
    );

    return response.data;

};