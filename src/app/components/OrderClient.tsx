"use client";
import { useState } from "react";
import axios from "axios";
import { Food } from "./FoodClient"; //

type OrderModalProps = {
    food: Food;
    onClose: () => void;
};

export default function OrderModal({ food, onClose }: OrderModalProps) {
    const [customerName, setCustomerName] = useState("");
    const [quantity, setQuantity] = useState(1);

    const handleOrderSubmit = async () => {
        try {
            await axios.post("http://localhost:3030/orders", {
                foodId: food._id,
                customerName,
                quantity,
                total: food.price * quantity,
            });
            alert("Order placed successfully!");
            onClose();
        } catch (error) {
            console.error("Error placing order:", error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Order {food.foodName}</h2>
                <label className="block mb-2">Your Name:</label>
                <input
                    type="text"
                    className="w-full border rounded-md p-2 mb-4"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                />
                <label className="block mb-2">Quantity:</label>
                <input
                    type="number"
                    className="w-full border rounded-md p-2 mb-4"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    min={1}
                />
                <p className="mb-4">Total: <strong>{food.price * quantity}₮</strong></p>
                <div className="flex justify-end space-x-2">
                    <button className="px-4 py-2 bg-gray-300 rounded-md" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="px-4 py-2 bg-red-500 text-white rounded-md" onClick={handleOrderSubmit}>
                        Confirm Order
                    </button>
                </div>
            </div>
        </div>
    );
}
