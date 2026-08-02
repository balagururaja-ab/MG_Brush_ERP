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
// Customer Pending Summary
//---------------------------------------------------------

export const getSalesPendingSummary = async () => {

    const response = await apiClient.get(
        "/sales/pending-summary"
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
// Create Sales From Order
//---------------------------------------------------------

export const createSalesFromOrder = async (
    orderId
) => {

    const response = await apiClient.post(
        `/sales/from-order/${orderId}`
    );

    return response.data;

};

//---------------------------------------------------------
// Get Sales By Order Id
//---------------------------------------------------------

export const getSalesByOrder = async (
    orderId
) => {

    const response = await apiClient.get(
        `/sales/by-order/${orderId}`
    );

    return response.data;

};

//---------------------------------------------------------
// Get Customer Outstanding Balance
//---------------------------------------------------------

export const getCustomerOutstandingBalance = async (
    customerId
) => {

    const response = await apiClient.get(
        `/sales/customer/${customerId}/outstanding`
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
// ---------------------------------------------------------
// Generate Invoice
// ---------------------------------------------------------

export const generateSalesInvoice = async (
    salesId,
    invoiceData
) => {

    const response = await apiClient.post(
        `/sales/${salesId}/invoice`,
        invoiceData
    );

    return response.data;

};

// ---------------------------------------------------------
// Record Payment
// ---------------------------------------------------------

export const recordSalesPayment = async (
    salesId,
    payment
) => {

    const response = await apiClient.post(
        `/sales/${salesId}/payment`,
        payment
    );

    return response.data;

};

// ---------------------------------------------------------
// Get Sales Payment Receipt
// ---------------------------------------------------------

export const getSalesPaymentReceipt = async (
    salesId,
    paymentId
) => {

    const response = await apiClient.get(
        `/sales/${salesId}/payment/${paymentId}`
    );

    return response.data;

};