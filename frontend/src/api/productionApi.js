import apiClient from "./apiClient";

//--------------------------------------
// Get All Productions
//--------------------------------------

export const getProductions = async () => {

    const response = await apiClient.get(
        "/productions"
    );

    return response.data;

};

//--------------------------------------
// Get Production By Id
//--------------------------------------

export const getProduction = async (
    productionId
) => {

    const response = await apiClient.get(
        `/productions/${productionId}`
    );

    return response.data;

};

//--------------------------------------
// Create Production
//--------------------------------------

export const createProduction = async (
    production
) => {

    const response = await apiClient.post(
        "/productions",
        production
    );

    return response.data;

};

//--------------------------------------
// Update Production
//--------------------------------------

export const updateProduction = async (
    productionId,
    production
) => {

    const response = await apiClient.put(
        `/productions/${productionId}`,
        production
    );

    return response.data;

};

//--------------------------------------
// Delete Production
//--------------------------------------

export const deleteProduction = async (
    productionId
) => {

    const response = await apiClient.delete(
        `/productions/${productionId}`
    );

    return response.data;

};