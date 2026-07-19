import axios from "axios";
import apiClient from "./apiClient";

const API = "http://127.0.0.1:8000/api/orders";

// -----------------------------------------------------
// List Orders
// -----------------------------------------------------

export async function getOrders() {

    const response = await axios.get(API);

    return response.data;

}

// -----------------------------------------------------
// Get Order
// -----------------------------------------------------

export async function getOrder(orderId) {

    const response = await axios.get(

        `${API}/${orderId}`

    );

    return response.data;

}

// -----------------------------------------------------
// Create Order
// -----------------------------------------------------

export async function createOrder(

    order,

    items

) {

    const response = await axios.post(

        API,

        {

            order,

            items

        }

    );

    return response.data;

}

// -----------------------------------------------------
// Update Order
// -----------------------------------------------------

export async function updateOrder(

    orderId,

    order,

    items

) {

    const response = await axios.put(

        `${API}/${orderId}`,

        {

            order,

            items

        }

    );

    return response.data;

}

// -----------------------------------------------------
// Delete Order
// -----------------------------------------------------

export async function deleteOrder(

    orderId

) {

    const response = await axios.delete(

        `${API}/${orderId}`

    );

    return response.data;

}

export const getBrands = async () => {
    const response = await apiClient.get("/masters/brands");
    return response.data;
};

export const getBrushSizes = async () => {
    const response = await apiClient.get("/masters/brush-sizes");
    return response.data;
};