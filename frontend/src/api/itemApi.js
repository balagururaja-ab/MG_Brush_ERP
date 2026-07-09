import apiClient from "./apiClient";

// Get All Items
export const getItems = async () => {
    const response = await apiClient.get("/items");
    return response.data;
};

// Get Item By Id
export const getItemById = async (itemId) => {
    const response = await apiClient.get(`/items/${itemId}`);
    return response.data;
};

// Create Item
export const createItem = async (item) => {
    const response = await apiClient.post("/items", item);
    return response.data;
};

// Update Item
export const updateItem = async (itemId, item) => {
    const response = await apiClient.put(`/items/${itemId}`, item);
    return response.data;
};

// Delete Item
export const deleteItem = async (itemId) => {
    const response = await apiClient.delete(`/items/${itemId}`);
    return response.data;
};