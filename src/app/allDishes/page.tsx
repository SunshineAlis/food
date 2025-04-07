"use client";
import React, { useState } from "react";
import FoodItem from "../components/Foods/FoodItem";
import { AddFood } from "../components/Foods/AddFood";
import { EditFood } from "../components/Foods/EditFood";
import { useCategoryContext } from "../Provider/CategoryProvider";
import { useRouter } from "next/navigation";
import { Food } from "@/type"
export default function AllDishes() {
    const { categories } = useCategoryContext();
    const [selectedFood, setSelectedFood] = useState<Food | null>(null);

    const [showAddFoodModal, setShowAddFoodModal] = useState(false);
    const router = useRouter();

    const handleEdit = (food: Food) => {
        setSelectedFood(food);
    };

    const allFoods = categories.flatMap((category) => category.foods || []);
    const displayedFoods = allFoods
    const allFoodsCount = allFoods.length;

    return (
        <div className="max-w-[1100px] w-[100%] m-auto">
            <h1 className="p-4 text-2xl font-bold">All dishes({allFoodsCount})</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

                <div className="h-70 w-full border border-red-500 rounded-xl flex justify-center items-center">
                    <div className="flex flex-col justify-center items-center">
                        <button
                            onClick={() => setShowAddFoodModal(true)}
                            className="bg-red-500 w-10 h-10 rounded-full text-white text-4xl"
                        >
                            +
                        </button>
                        <p className="text-black w-[70%] text-center mt-4">
                            Add new Dish to Appetizers
                        </p>
                    </div>
                </div>

                {
                    displayedFoods.map((food) => (
                        <FoodItem
                            key={food._id}
                            food={food}
                            onEdit={() => handleEdit(food)}
                        />
                    ))
                }

                {showAddFoodModal && <AddFood setShowAddFoodModal={setShowAddFoodModal} />}
                {
                    selectedFood && (
                        <EditFood
                            editingFood={selectedFood}
                            setEditingFood={setSelectedFood}
                        />
                    )
                }
            </div >
        </div>
    );
}
