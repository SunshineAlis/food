"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
export const OrderContext = createContext<OrderContextType | undefined>(undefined);
export const useOrderContext = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error("useOrderContext must be used within an OrderProvider");
    }
    return context;
};
export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
    const [userOrders, setUserOrders] = useState<UserOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const API_URL = "https://service-jus0.onrender.com";
    const fetchOrders = async () => {
        try {
            const res = await axios.get<{ data: UserOrder[] }>(`${API_URL}/order`);
            setUserOrders(res.data.data);
            setError(null);
        } catch (err) {
            setError("Failed to load orders. Please try again later.");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchOrders();
    }, []);
    const handleDeleteOrder = async (orderId: string) => {
        try {
            const response = await axios.delete(`${API_URL}/order/${orderId}`);
            if (response.data.success) {
                setUserOrders(prev =>
                    prev
                        .map(user => ({
                            ...user,
                            orders: user.orders.filter(order => order._id !== orderId),
                        }))
                        .filter(user => user.orders.length > 0)
                );
            } else {
                setError(response.data.message || "Failed to delete order");
            }
        } catch (err: any) {
            console.error("Delete error:", err);
            setError(err.response?.data?.message || err.message || "Delete failed");
        }
    };
    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            await axios.put(`${API_URL}/order/${orderId}`, { orderStatus: newStatus });
            setUserOrders(prev =>
                prev.map(user => ({
                    ...user,
                    orders: user.orders.map(order =>
                        order._id === orderId ? { ...order, orderStatus: newStatus } : order
                    ),
                }))
            );
        } catch (err) {
            console.error("Status update error:", err);
            setError("Failed to update order status.");
        }
    };
    return (
        <OrderContext.Provider
            value={{
                userOrders,
                loading,
                error,
                refetch: fetchOrders,
                handleDeleteOrder,
                handleStatusChange,
            }}
        >
            {children}
        </OrderContext.Provider>
    );
};
