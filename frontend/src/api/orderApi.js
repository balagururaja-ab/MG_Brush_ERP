import axios from "axios";

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