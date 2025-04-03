"use client";
import { useEffect, useState } from "react";
import axios from "axios";

type Order = {
    _id: string;
    user: { _id: string; name: string; email: string; phone: string; address: string };
    food: { _id: string; name: string; price: number; category: string };
    totalPrice: number;
    status: "PENDING" | "CANCELED" | "DELIVERED";
    category?: string;
    image: string;
};

const OrderTable: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get("http://localhost:3030/order");
                console.log(response)
                if (response.data && Array.isArray(response.data.orders)) {
                    setOrders(response.data.orders);
                } else {
                    throw new Error("Invalid data format");
                }
            } catch (error) {
                setError(error instanceof Error ? error.message : "Failed to fetch orders");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <p>Loading orders...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <h2>Orders</h2>
            <table className="order-table">
                <thead>
                    <tr>
                        <th>User Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Food Name</th>
                        <th>Food Price</th>
                        <th>Food Category</th>
                        <th>Total Price</th>
                        <th>Status</th>
                        <th>Image</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order._id}>
                            <td>{order.user?.name || "Unknown User"}</td>
                            <td>{order.user?.email || "No Email"}</td>
                            <td>{order.user?.phone || "No Phone"}</td>
                            <td>{order.user?.address || "No Address"}</td>
                            <td>{order.food?.name || "Unknown Food"}</td>
                            <td>${order.food?.price.toFixed(2) || "N/A"}</td>
                            <td>{order.food?.category || "No Category"}</td>
                            <td>${order.totalPrice.toFixed(2)}</td>
                            <td>{order.status}</td>
                            <td>
                                <img src={order.image} alt="Order" width="50" height="50" />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderTable;
