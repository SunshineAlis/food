"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { PenIcon } from "lucide-react";
import { AddFood } from "./addFood";
import { EditFood } from "./EditFood";

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

export default function Foods() {
  const [categoriesWithFoods, setCategoriesWithFoods] = useState<Category[]>(
    []
  );
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAddFoodModal, setShowAddFoodModal] = useState(false);

  useEffect(() => {
    const fetchCategoriesWithFoods = async () => {
      try {
        const categoryResponse = await axios.get(
          "http://localhost:3030/category"
        );
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
                `Error fetching foods for category ${category._id}:`,
                error
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

  const handleFoodClick = (food: Food) => {
    setSelectedFood(food);
    setDropdown(null);
  };

  const handleEdit = (food: Food) => {
    setEditingFood(food);
  };

  const handleDelete = async (foodId: string) => {
    try {
      await axios.delete(`http://localhost:3030/foods/${foodId}`);
      setSelectedFood(null);
      setDropdown(null);
      const updatedCategories = categoriesWithFoods.map((category) => ({
        ...category,
        foods: category.foods?.filter((food) => food._id !== foodId),
      }));
      setCategoriesWithFoods(updatedCategories);
    } catch (error) {
      console.error("Error deleting food:", error);
    }
  };
  const allFoods = categoriesWithFoods.map((category) => category.foods).flat();

  return (
    <div className="p-4 bg-gray-100 max-w-[900px] w-full m-auto rounded-2xl">
      <h2 className="text-xl font-bold mb-4">Foods by Category</h2>
      {categoriesWithFoods.length > 0 ? (
        categoriesWithFoods.map((category) => (
          <div key={category._id} className="mb-6">
            <h3 className="text-lg font-semibold mb-2">
              {category.categoryName}
            </h3>
            <div className="grid grid-cols-4 gap-2">
              <div className="h-70 w-full border border-red-500 rounded-xl flex justify-center items-center">
                <div className="flex flex-col justify-center items-center">
                  <button
                    onClick={() => {
                      setSelectedCategory(category._id);
                      setShowAddFoodModal(true);
                    }}
                    className="bg-red-500 w-10 h-10 rounded-full text-white text-4xl"
                  >
                    +
                  </button>
                  <p className="text-black w-[70%] text-center mt-4">
                    Add new Dish to Appetizers{" "}
                  </p>
                </div>
              </div>
              {category.foods && category.foods.length > 0 ? (
                category.foods.map((food) => (
                  <div
                    key={food._id}
                    className="relative p-2 border  border-gray-400 rounded-lg bg-white"
                  >
                    {food.image && (
                      <img
                        src={food.image as string}
                        alt={food.foodName}
                        className="h-30 w-full object-cover rounded-md"
                      />
                    )}
                    <div className="flex justify-between items-center mt-2">
                      <span
                        className="text-red-500 truncate w-[75%] hover:overflow-visible hover:whitespace-normal"
                        title={food.foodName}
                      >
                        {food.foodName}
                      </span>
                      <span className="text-gray-700">${food.price}</span>
                    </div>
                    <p className="text-sm text-gray-600 h-20 overflow-hidden hover:h-full">
                      {food.ingredients}
                    </p>
                    <button
                      className="absolute top-20 right-6 p-1 bg-white rounded-full shadow"
                      onClick={(e) => {
                        handleFoodClick(food);
                        e.preventDefault();
                        setDropdown(dropdown === food._id ? null : food._id);
                      }}
                    >
                      <PenIcon className="text-red-500 w-5 h-5" />
                    </button>
                    {dropdown === food._id && (
                      <div className="absolute top-8 right-0 bg-white shadow-lg rounded-lg p-2 w-40 cursor-pointer">
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
        <AddFood setShowAddFoodModal={setShowAddFoodModal} />
      )}
      {editingFood && (
        <EditFood editingFood={editingFood} setEditingFood={setEditingFood} />
      )}
    </div>
  );
}
