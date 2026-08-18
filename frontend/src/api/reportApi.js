import apiClient from "./apiClient";

export const getReportsOverview = async () => {

    const response = await apiClient.get(
        "/reports/overview"
    );

    return response.data;

};

export const getCustomerSalesReport = async (params = {}) => {

    const response = await apiClient.get(
        "/reports/customer-sales",
        { params }
    );

    return response.data;

};

export const getSupplierPurchaseReport = async (params = {}) => {

    const response = await apiClient.get(
        "/reports/supplier-purchases",
        { params }
    );

    return response.data;

};

export const getMandatoryReports = async () => {

    const response = await apiClient.get(
        "/reports/mandatory"
    );

    return response.data;

};
