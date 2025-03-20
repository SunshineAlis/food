"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import OrderModal from "./OrderClient";

type Category = {
    _id: string;
    categoryName: string;
    foods?: Food[];
};

export type Food = {
    _id: string;
    foodName: string;
    price: number;
    ingredients: string;
    image?: string | null | File;
    categoryId?: string;
    imageUrl?: string;
};

export default function FoodClient() {
    const [categoriesWithFoods, setCategoriesWithFoods] = useState<Category[]>([]);
    const [selectedFood, setSelectedFood] = useState<Food | null>(null);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchCategoriesWithFoods = async () => {
            try {
                const categoryResponse = await axios.get("http://localhost:3030/category");
                const categories = categoryResponse.data.data;

                const categoriesData = await Promise.all(
                    categories.map(async (category: Category) => {
                        try {
                            const foodResponse = await axios.get<{ foods: Food[] }>(
                                `http://localhost:3030/foods/${category._id}/foods`
                            );
                            return { ...category, foods: foodResponse.data.foods || [] };
                        } catch (error) {
                            console.error(
                                `Error fetching foods for category ${category._id}:`, error
                            );
                            return { ...category, foods: [] };
                        }
                    })
                );
                setCategoriesWithFoods(categoriesData);
            } catch (error) {
                console.error("Error fetching categories with foods:", error);
            }
        };
        fetchCategoriesWithFoods();
    }, []);


    const orderFood = (food: Food) => {
        setSelectedFood(food);
        setShowOrderModal(true);
    };


    const handleOrderDelete = async (foodId: string) => {
        try {
            await axios.delete(`http://localhost:3030/orders/${foodId}`);
            alert("Order deleted successfully!");
        } catch (error) {
            console.error("Error deleting order:", error);
        }
    };

    return (
        <div className="p-4 bg-gray-100 max-w-[900px] w-full m-auto rounded-2xl">
            <h2 className="text-xl font-bold mb-4">Foods by Category</h2>

            {categoriesWithFoods.map((category) => (
                <div key={category._id} className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">{category.categoryName}</h3>
                    <div className="grid grid-cols-4 gap-2">
                        {category.foods && category.foods.length > 0 ? (
                            category.foods.map((food) => (
                                <div key={food._id} className="border p-2 border-gray-400 rounded-lg bg-white h-full ">
                                    {food.image && (
                                        <img
                                            src={food.image as string}
                                            alt={food.foodName}
                                            className="h-30 w-full object-cover rounded-md"
                                        />
                                    )}
                                    <div className="flex flex-col justify-between items-start mt-2 relative">
                                        <div className="flex justify-between w-full">
                                            <p className="text-red-500 font-bold">{food.foodName}</p>
                                            <p className="text-gray-700">{food.price}₮</p>
                                        </div>
                                        <p className="font-bold">
                                            Ingredients:
                                            <span className="font-normal pl-2">{food.ingredients}</span>
                                        </p>
                                    </div>
                                    <button
                                        className="w-full bg-red-500 text-white py-1 mt-2 rounded-lg"
                                        onClick={() => orderFood(food)}
                                    >
                                        Order
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No foods available</p>
                        )}
                    </div>
                </div>
            ))}

            {showOrderModal && selectedFood && (
                <OrderModal
                    food={selectedFood}
                    onClose={() => setShowOrderModal(false)}
                />
            )}
        </div>
    );
}

