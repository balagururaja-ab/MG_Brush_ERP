import apiClient from "./apiClient";

export const getItems = async () => {
    const response = await apiClient.get("/items");
    return response.data;
};

export const getItem = async (id) => {
    const response = await apiClient.get(`/items/${id}`);
    return response.data;
};

export const createItem = async (item) => {
    const response = await apiClient.post("/items", item);
    return response.data;
};

export const updateItem = async (id, item) => {
    const response = await apiClient.put(`/items/${id}`, item);
    return response.data;
};

export const deactivateItem = async (id) => {
    const response = await apiClient.delete(`/items/${id}`);
    return response.data;
};

export const activateItem = async (id) => {
    const response = await apiClient.patch(`/items/${id}/activate`);
    return response.data;
};

export const getBrands = async () => {
    const response = await apiClient.get("/masters/brands");
    return response.data;
};

export const getBrushSizes = async () => {
    const response = await apiClient.get("/masters/brush-sizes");
    return response.data;
};

// -------------------------------
// Master Dropdown APIs
// -------------------------------

export const getCategories = async () => {
    const response = await apiClient.get("/masters/item-categories");
    return response.data;
};

export const getUnits = async () => {
    const response = await apiClient.get("/masters/units");
    return response.data;
};

export const getTaxes = async () => {
    const response = await apiClient.get("/masters/taxes");
    return response.data;
};