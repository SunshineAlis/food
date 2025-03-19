"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

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
  image?: string | null | File;
  categoryId?: string;
  imageUrl?: string;
};
const initialValue = {
  foodName: "",
  price: 0,
  ingredients: "",
  image: null,
  imageUrl: "",
  categoryId: undefined,
};

type AddFoodProps = {
  setShowAddFoodModal: (value: boolean) => void;

};

export const AddFood = ({ setShowAddFoodModal }: AddFoodProps) => {
  console.log("add food called");

  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>();
  const [newFood, setNewFood] = useState<Omit<Food, "_id">>(initialValue);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3030/category");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleAddFood = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("foodName", newFood.foodName);
    formData.append("price", String(newFood.price));
    formData.append("ingredients", newFood.ingredients);
    formData.append("categoryId", selectedCategory as string);

    if (newFood.image) {
      formData.append("image", newFood.image);
    }

    try {
      const response = await axios.post(
        "http://localhost:3030/foods",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setNewFood(initialValue);
    } catch (error) {
      console.error("Error adding food:", error);
    } finally {
      setLoading(false);
      setShowAddFoodModal(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setNewFood({
        ...newFood,
        image: file,
        imageUrl: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmitFood = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddFood();
  };

  return (
    <div>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <form
          onSubmit={handleSubmitFood}
          className="flex flex-col gap-3 bg-white p-6 rounded-lg shadow-lg w-1/3"
        >
          <h2 className="text-lg font-semibold mb-4">Add Food</h2>
          <div className="flex gap-2 h-10 w-full my-4 rounded-xl">
            {/* Food Name */}
            <div className="mb-4">
              <label htmlFor="foodName" className="block text-sm text-gray-700">
                Food Name
              </label>
              <input
                id="foodName"
                type="text"
                value={newFood.foodName}
                onChange={(e) =>
                  setNewFood({ ...newFood, foodName: e.target.value })
                }
                className="w-full border rounded-md py-2"
                required
              />
            </div>

            {/* Price */}
            <div className="mb-4">
              <label htmlFor="price" className="block text-sm text-gray-700">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={newFood.price}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  setNewFood({ ...newFood, price: isNaN(value) ? 0 : value });
                }}
                placeholder="Food Price"
                className="border p-2 rounded-md"
                required
              />
            </div>
          </div>

          {/* Ingredients */}
          <div className="mb-4">
            <label
              htmlFor="ingredients"
              className="block text-sm text-gray-700"
            >
              Ingredients
            </label>
            <textarea
              id="ingredients"
              value={newFood.ingredients}
              onChange={(e) =>
                setNewFood({ ...newFood, ingredients: e.target.value })
              }
              className="w-full border px-2 py-1 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="category" className="block text-sm text-gray-700">
              Category
            </label>
            <select
              id="category"
              value={selectedCategory || ""}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border px-2 py-1 rounded-md"
              required
            >
              <option value="">Select Category</option>
              {categories?.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="image" className="block text-sm text-gray-700">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border px-2 py-1 rounded-md"
            />
            {newFood.imageUrl && (
              <img
                src={newFood.imageUrl}
                alt="Preview"
                className="mt-2 h-32 w-32 object-cover t"
              />
            )}
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setShowAddFoodModal(false)}
              className="px-4 py-2 bg-gray-300 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-red-500 text-white rounded-md"
            >
              {loading ? "Adding..." : "Add Food"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
