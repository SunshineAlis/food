"use client";
import React, { useState } from "react";
import FoodItem from "./FoodItem";
import { AddFood } from "./AddFood";
import { EditFood } from "./EditFood";
import { useCategoryContext } from "../../Provider/CategoryProvider";
import { useRouter } from "next/navigation";
import { Food } from "@/type"

export default function Foods() {
  const { categories, deleteFoodFromCategory, refetch } = useCategoryContext();
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [showAddFoodModal, setShowAddFoodModal] = useState(false);
  const router = useRouter();

  const handleEdit = (food: Food) => {
    setSelectedFood(food);
  };

  const allFoods = categories.flatMap((category) => category.foods || []);
  const displayedFoods = allFoods.slice(0, 3);
  const allFoodsCount = allFoods.length;

  return (
    <div className="p-4 bg-gray-100 max-w-[900px] w-full m-auto rounded-2xl">
      <h2 className="text-xl font-bold mb-4">Foods by Category</h2>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold mb-2">All Dishes ({allFoodsCount})</h3>
        <button
          className="text-blue-500 underline py-2 cursor-pointer"
          onClick={() => router.push("/allDishes")}
        >
          See All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="h-70 w-full border border-red-500 rounded-xl flex justify-center items-center">
          <div className="flex flex-col justify-center items-center">
            <button
              onClick={() => {
                setShowAddFoodModal(true);
              }}
              className="bg-red-500 w-10 h-10 rounded-full text-white text-4xl"
            >
              +
            </button>
            <p className="text-black w-[70%] text-center mt-4">
              Add new Dish to Appetizers
            </p>
          </div>
        </div>
        {displayedFoods.map((food) => (
          <FoodItem
            key={food._id}
            food={food}
            onEdit={() => handleEdit(food)}
          />
        ))}
      </div>
      <hr className="border-t border-gray-500 my-4" />
      {categories.map((category) => (
        <div key={category._id} className="mb-6">
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold mb-2">
              {category.categoryName} ({category.foodCount || 0})
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {category.foods && category.foods.length > 0 ? (
              category.foods.map((food) => (
                <FoodItem
                  key={food._id}
                  food={food}
                  onEdit={() => handleEdit(food)}
                />
              ))
            ) : (
              <p className="text-gray-500">No foods available</p>
            )}
          </div>
        </div>
      ))}

      {showAddFoodModal && <AddFood setShowAddFoodModal={setShowAddFoodModal} />}
      {selectedFood && (
        <EditFood
          editingFood={selectedFood}
          setEditingFood={setSelectedFood}
        />
      )}
    </div>
  );
}
