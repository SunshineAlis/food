"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { IoLocationOutline } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import { SlBasket } from "react-icons/sl";

export default function OrderPage() {
    const [location, setLocation] = useState<string>("Please enter location");
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [basket, setBasket] = useState<{ id: string; name: string; price: number }[]>([]);
    const [loadingBasket, setLoadingBasket] = useState(false);
    const [error, setError] = useState("");

    // 📍 Байршлыг авах функц
    const getLocation = async () => {
        if (!navigator.geolocation) {
            alert("Таны браузер байршил авахыг дэмжихгүй байна.");
            return;
        }

        setLoadingLocation(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    const response = await axios.get(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );

                    if (response.data.display_name) {
                        setLocation(response.data.display_name);
                    } else {
                        setLocation("Хаяг олдсонгүй");
                    }
                } catch (error) {
                    console.error("Хаяг авах үед алдаа гарлаа:", error);
                    setLocation("Алдаа гарлаа");
                } finally {
                    setLoadingLocation(false);
                }
            },
            (error) => {
                console.error("Байршил авах үед алдаа гарлаа:", error);
                setLocation("Байршил олдсонгүй");
                setLoadingLocation(false);
            }
        );
    };

    useEffect(() => {
        const fetchOrders = async () => {
            setLoadingBasket(true);
            setError("");

            try {
                const response = await axios.get("http://localhost:3030/order");
                setBasket(response.data.orders);
            } catch (err) {
                setError("can't fetching food!");
            } finally {
                setLoadingBasket(false);
            }
        };

        fetchOrders();
    }, []);

    // 🗑️ Захиалгыг устгах
    const removeItem = async (id: string) => {
        try {
            await axios.delete(`https://your-backend.com/api/order/remove/${id}`);
            setBasket((prev) => prev.filter((item) => item.id !== id));
        } catch (err) {
            setError("Хоол устгах үед алдаа гарлаа!");
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            {/* 📍 Байршил авах */}
            <div className="bg-white p-4 shadow-md rounded-lg mb-6">
                <h2 className="text-lg font-semibold mb-2">📍 Хүргэлтийн хаяг</h2>
                <div className="flex items-center space-x-2">
                    <IoLocationOutline className="text-xl text-red-500" />
                    <input
                        className="border p-2 w-full rounded-lg focus:outline-none"
                        placeholder="Байршил авах"
                        value={loadingLocation ? "Татаж байна..." : location}
                        readOnly
                    />
                    <button
                        onClick={getLocation}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                        <IoIosArrowForward />
                    </button>
                </div>
            </div>

            {/* 🛒 Захиалсан хоолны жагсаалт */}
            <div className="bg-white p-4 shadow-md rounded-lg">
                <h2 className="text-lg font-semibold mb-2">🛒 Миний сагс</h2>

                {loadingBasket ? (
                    <p className="text-gray-500">Loading...</p>
                )
                    : basket.length === 0 ? (
                        <p className="text-gray-500">Don't have any order.</p>
                    ) : (
                        <ul>
                            {basket.map((item) => (
                                <li key={item.id} className="flex justify-between items-center border-b py-2">
                                    <span className="text-black">{item.name} - ${item.price}</span>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Устгах
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
            </div>
        </div>
    );
}
