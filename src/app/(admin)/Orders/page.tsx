"use client";
import { useState, useEffect } from "react";
import axios from "axios";



export default function () {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const response = await axios.get("http://localhost:3030/orders");
            if (response.data && Array.isArray(response.data.orders)) {
                setOrders(response.data.orders);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };
    return (
        <div>

        </div>
    )
}