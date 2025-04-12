"use client";
import React, { useState } from "react";
import { useOrderContext } from "../../Provider/OrderProvider";
import { OrdersTableHead } from "./OrderTableHead";
import HoveredOrder from "./HoveredOrder";
const OrdersTable: React.FC = () => {
    const { userOrders, loading, error, handleDeleteOrder, handleStatusChange } = useOrderContext();
    const [hoveredOrder, setHoveredOrder] = useState<string | null>(null);
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };
    return (
        <div className="p-4 max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Order List</h2>
            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : userOrders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No orders found</p>
            ) : (
                <div className="space-y-6">
                    {userOrders.map((user) => (
                        <div
                            key={user.email}
                            className="border border-gray-200 rounded-lg shadow-md p-4 bg-white"
                        >
                            <div className="mb-4 flex justify-between items-center">
                                <span className="text-sm text-gray-500">
                                    {user.orders.length} order
                                    {user.orders.length > 1 ? "s" : ""}
                                </span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <OrdersTableHead />
                                    <tbody className="divide-y divide-gray-200">
                                        {user.orders.map((order, index) => (
                                            <tr key={order._id}>
                                                <td className="px-4 py-3 text-sm">{index + 1}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {user.email}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-700">
                                                    Хаяг: {order.address} Утас:{order.phone}
                                                </td>
                                                <td
                                                    className="w-15 px-2 py-3 text-sm relative"
                                                    onMouseEnter={() => setHoveredOrder(order._id)}
                                                    onMouseLeave={() => setHoveredOrder(null)}
                                                >
                                                    <span className="underline cursor-pointer">
                                                        {order.foodList.reduce(
                                                            (sum, item) => sum + item.quantity,
                                                            0
                                                        )}{" "}
                                                        foods
                                                    </span>
                                                    {hoveredOrder === order._id && (
                                                        < HoveredOrder order={order} />
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-sm font-semibold">
                                                    ₮{order.orderTotal.toLocaleString()}
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    <select
                                                        value={order.orderStatus}
                                                        onChange={(e) =>
                                                            handleStatusChange(order._id, e.target.value)
                                                        }
                                                        className="bg-gray-100 rounded px-1 py-1 text-sm"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="processing">Processing</option>
                                                        <option value="completed">Completed</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                                <td className="w-30 px-2 py-3 text-sm text-gray-500 text-center">
                                                    {formatDate(order.createdAt)}
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    <button
                                                        onClick={() => handleDeleteOrder(order._id)}
                                                        className="text-red-600 hover:underline"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            )
            }
        </div >
    );
};
export default OrdersTable;
