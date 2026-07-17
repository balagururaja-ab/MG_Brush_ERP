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

export const deleteItem = async (id) => {
    const response = await apiClient.delete(`/items/${id}`);
    return response.data;
};

export const getCategories = () =>
    api.get("/item-categories");

export const getUnits = () =>
    api.get("/units");

export const getTaxes = () =>
    api.get("/taxes");