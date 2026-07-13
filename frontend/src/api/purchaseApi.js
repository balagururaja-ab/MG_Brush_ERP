import apiClient from "./apiClient";

//--------------------------------------
// Get All Purchases
//--------------------------------------

export const getPurchases = async () => {

    const response = await apiClient.get(
        "/purchases"
    );

    return response.data;

};

//--------------------------------------
// Get Purchase
//--------------------------------------

export const getPurchase = async (
    purchaseId
) => {

    const response = await apiClient.get(
        `/purchases/${purchaseId}`
    );

    return response.data;

};

//--------------------------------------
// Create Purchase
//--------------------------------------

export const createPurchase = async (
    purchase
) => {

    const response = await apiClient.post(
        "/purchases",
        purchase
    );

    return response.data;

};

//--------------------------------------
// Update Purchase
//--------------------------------------

export const updatePurchase = async (
    purchaseId,
    purchase
) => {

    const response = await apiClient.put(
        `/purchases/${purchaseId}`,
        purchase
    );

    return response.data;

};

//--------------------------------------
// Delete Purchase
//--------------------------------------

export const deletePurchase = async (
    purchaseId
) => {

    const response = await apiClient.delete(
        `/purchases/${purchaseId}`
    );

    return response.data;

};

