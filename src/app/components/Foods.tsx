"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { PenIcon } from "lucide-react";

type Category = {
    _id: string;
    categoryName: string;
    foods?: Food[];
};

type Food = {
    _id: string;
    foodName: string;
    price: number;
    ingredients: string;
    image?: string;
    categoryId: string;
};

export default function FoodsByCategory() {
    const [categoriesWithFoods, setCategoriesWithFoods] = useState<Category[]>([]);
    const [selectedFood, setSelectedFood] = useState<Food | null>(null);
    const [editingFood, setEditingFood] = useState<Food | null>(null);
    const [dropdown, setDropdown] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [showAddFoodModal, setShowAddFoodModal] = useState(false);
    const [newFood, setNewFood] = useState<Omit<Food, "_id">>({
        foodName: "",
        price: 0,
        ingredients: "",
        image: "",
        categoryId: "",
    });

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
                            console.error(`Error fetching foods for category ${category._id}:`, error);
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

    const handleFoodClick = (food: Food) => {
        setSelectedFood(food);
        setDropdown(null);
    };

    const handleEdit = (food: Food) => {
        setEditingFood(food);
    };

    const handleSave = async (updatedFood: Food) => {
        try {
            await axios.put(`http://localhost:3030/foods/${updatedFood._id}`, updatedFood);
            setEditingFood(null);
            setDropdown(null);
            // Refresh the list
            const updatedCategories = categoriesWithFoods.map(category => ({
                ...category,
                foods: category.foods?.map(food => food._id === updatedFood._id ? updatedFood : food)
            }));
            setCategoriesWithFoods(updatedCategories);
        } catch (error) {
            console.error("Error updating food:", error);
        }
    };

    const handleDelete = async (foodId: string) => {
        try {
            await axios.delete(`http://localhost:3030/foods/${foodId}`);
            setSelectedFood(null);
            setDropdown(null);
            // Refresh the list
            const updatedCategories = categoriesWithFoods.map(category => ({
                ...category,
                foods: category.foods?.filter(food => food._id !== foodId)
            }));
            setCategoriesWithFoods(updatedCategories);
        } catch (error) {
            console.error("Error deleting food:", error);
        }
    };

    const handleAddFood = async () => {
        try {
            const response = await axios.post("http://localhost:3030/foods", {
                ...newFood,
                categoryId: selectedCategory,
            });
            const addedFood = response.data;

            // Refresh the list
            const updatedCategories = categoriesWithFoods.map(category => {
                if (category._id === selectedCategory) {
                    return {
                        ...category,
                        foods: [...(category.foods || []), addedFood]
                    };
                }
                return category;
            });
            setCategoriesWithFoods(updatedCategories);
            setShowAddFoodModal(false);
            setNewFood({
                foodName: "",
                price: 0,
                ingredients: "",
                image: "",
                categoryId: "",
            });
        } catch (error) {
            console.error("Error adding food:", error);
        }
    };

    return (
        <div className="p-4 bg-gray-100 max-w-[900px] w-full m-auto rounded-2xl">
            <h2 className="text-xl font-bold mb-4">Foods by Category</h2>

            {categoriesWithFoods.length > 0 ? (
                categoriesWithFoods.map((category) => (
                    <div key={category._id} className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">{category.categoryName}</h3>
                        <div className="grid grid-cols-4 gap-2">
                            <div className="h-60 w-full  border border-red-500 rounded-xl flex justify-center items-center">
                                <button
                                    onClick={() => {
                                        setSelectedCategory(category._id);
                                        setShowAddFoodModal(true);
                                    }}
                                    className="bg-red-500 w-10 h-10 rounded-full text-white"
                                >
                                    +
                                </button>
                            </div>
                            {category.foods && category.foods.length > 0 ? (
                                category.foods.map((food) => (
                                    <div key={food._id} className="relative p-2 border rounded-lg bg-white">
                                        {food.image && <img src={food.image} alt={food.foodName} className="h-24 w-full object-cover rounded-md" />}
                                        <div className="flex justify-between items-center mt-2">
                                            <span className=" text-red-500 truncate w-[75%] hover:overflow-visible hover:whitespace-normal " title={food.foodName}>
                                                {food.foodName}
                                            </span>

                                            <span className="text-gray-700">${food.price}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 h-20 overflow-hidden hover:h-full">{food.ingredients}</p>
                                        <button
                                            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow"
                                            onClick={() => handleFoodClick(food)}
                                            onContextMenu={(e) => {
                                                e.preventDefault();
                                                setDropdown(dropdown === food._id ? null : food._id);
                                            }}
                                        >
                                            <PenIcon className="text-red-500 w-5 h-5" />
                                        </button>
                                        {dropdown === food._id && (
                                            <div className="absolute top-8 right-0 bg-white shadow-lg rounded-lg p-2 w-40 z-10">
                                                <button
                                                    className="block px-3 py-1 text-blue-500 hover:bg-gray-100 w-full text-left"
                                                    onClick={() => handleEdit(food)}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="block px-3 py-1 text-red-500 hover:bg-gray-100 w-full text-left"
                                                    onClick={() => handleDelete(food._id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No foods available</p>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <p>Loading categories and foods...</p>
            )}

            {showAddFoodModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Add New Food</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleAddFood();
                            }}
                        >
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Food Name</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newFood.foodName}
                                    onChange={(e) => setNewFood({ ...newFood, foodName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Price</label>
                                <input
                                    type="number"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newFood.price}
                                    onChange={(e) => setNewFood({ ...newFood, price: parseFloat(e.target.value) })}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Ingredients</label>
                                <textarea
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newFood.ingredients}
                                    onChange={(e) => setNewFood({ ...newFood, ingredients: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newFood.image}
                                    onChange={(e) => setNewFood({ ...newFood, image: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
                                    onClick={() => setShowAddFoodModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                                >
                                    Add Food
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}