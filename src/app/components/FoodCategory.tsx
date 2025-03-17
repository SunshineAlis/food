"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import AddFoodModal from "@/app/components/AddFoodModal";
import CategoryComponent from "@/app/components/CategoryCom";

type Category = {
    _id: string;
    categoryName: string;
};

type Food = {
    _id: string;
    foodName: string;
    price: number;
    ingredients: string;
    image?: string;
    categoryId: string;
};

export default function FoodCategory() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [showFoodModal, setShowFoodModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [foodCountByCategory, setFoodCountByCategory] = useState<{ [categoryId: string]: number }>({});
    const [loading, setLoading] = useState(false);

    // 获取分类和食物数量
    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const response = await axios.get("http://localhost:3030/category");
                if (response.data && Array.isArray(response.data.data)) {
                    const cats: Category[] = response.data.data;
                    setCategories(cats);

                    // 获取每个分类的食物数量
                    const counts: { [key: string]: number } = {};
                    await Promise.all(
                        cats.map(async (cat) => {
                            try {
                                const res = await axios.get(`http://localhost:3030/foods/${cat._id}/foodCount`);
                                counts[cat._id] = res.data.count;
                            } catch (err) {
                                console.error(`Error fetching food count for category ${cat._id}:`, err);
                                counts[cat._id] = 0;
                            }
                        })
                    );
                    setFoodCountByCategory(counts);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleAddFood = async (newFood: Food) => {
        if (!selectedCategory) {
            console.error("No category selected!");
            return;
        }

        try {
            const response = await axios.post("http://localhost:3030/foods", {
                ...newFood,
                categoryId: selectedCategory,
            });

            setFoodCountByCategory((prevState) => ({
                ...prevState,
                [selectedCategory]: (prevState[selectedCategory] || 0) + 1,
            }));

            setSuccessMessage("Food added successfully!");
        } catch (error) {
            console.error("Error adding food:", error);
            setSuccessMessage("Failed to add food. Please try again.");
        }
    };

    const handleDelete = async (catId: string) => {
        try {
            await axios.delete(`http://localhost:3030/category/${catId}`);
            setCategories((prev) => prev.filter((cat) => cat._id !== catId));
            setFoodCountByCategory((prev) => {
                const newCounts = { ...prev };
                delete newCounts[catId];
                return newCounts;
            });

            if (selectedCategory === catId) {
                setSelectedCategory(null);
            }
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage("");
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    return (
        <div className="p-4">
            <CategoryComponent
                categories={categories}
                foodCountByCategory={foodCountByCategory}
                setSelectedCategory={setSelectedCategory}
                openAddFoodModal={(catId: string) => {
                    if (!catId) {
                        console.error("No category selected!");
                        return;
                    }
                    setSelectedCategory(catId);
                    setShowFoodModal(true);
                }}
                handleDelete={handleDelete}
            />

            {showFoodModal && (
                <AddFoodModal
                    selectedCategory={selectedCategory}
                    onClose={() => setShowFoodModal(false)}
                    onAddFood={handleAddFood}
                    setSuccessMessage={setSuccessMessage}
                />
            )}

            {successMessage && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 bg-opacity-20 w-[280px] h-10 flex items-center justify-center rounded-xl">
                    {successMessage}
                </div>
            )}
        </div>
    );
}