import React, { useState } from "react";
import axios from "axios";
import { useCategoryContext } from "../../Provider/CategoryProvider";
import { Food, AddFoodProps } from "@/type";
import { ImageUploader } from "./ImageUpload";

const initialValue = {
  foodName: "",
  price: 0,
  ingredients: "",
  image: null,
  categoryId: undefined,
};

export const AddFood = ({ setShowAddFoodModal }: AddFoodProps) => {
  const { categories, addFoodToCategory, refetch } = useCategoryContext();
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [newFood, setNewFood] = useState<Omit<Food, "_id">>(initialValue);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

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
      addFoodToCategory(response.data);
      setNewFood(initialValue);
      setImagePreview(null);
      setMessage("Food added successfully");
      setTimeout(() => {
        setMessage(null);
        setShowAddFoodModal(false);
        refetch();
      }, 2000);
    } catch (error) {
      console.error("Error adding food:", error);
      setMessage("Err adding food");
      setTimeout(() => setMessage(null), 2000);
    } finally {
      setLoading(false);
    }
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setNewFood({
        ...newFood,
        image: file,
      });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitFood = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddFood();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmitFood}
        className="bg-white p-6 rounded-lg w-full md:w-[60%] lg:w-[40%] max-h-[90vh] overflow-y-auto shadow-lg"
      >
        <h2 className="text-lg font-semibold mb-4">Add Food</h2>
        <div className="flex gap-2">
          <div className="flex flex-col flex-1">
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
              className="w-full border rounded-md py-2 px-3"
              required
            />
          </div>
          <div className="flex flex-col w-1/3">
            <label htmlFor="price" className="block text-sm text-gray-700">
              Price
            </label>
            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={newFood.price}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                setNewFood({ ...newFood, price: isNaN(value) ? 0 : value });
              }}
              className="w-full border rounded-md py-2 px-3"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="ingredients" className="block text-sm text-gray-700">
            Ingredients
          </label>
          <textarea
            id="ingredients"
            value={newFood.ingredients}
            onChange={(e) =>
              setNewFood({ ...newFood, ingredients: e.target.value })
            }
            className="w-full border rounded-md py-2 px-3 h-20"
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
            className="w-full border rounded-md py-2 px-3"
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

        <ImageUploader
          imagePreview={imagePreview}
          handleImageChange={handleImageChange}
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => setShowAddFoodModal(false)}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-red-300"
          >
            {loading ? "Adding..." : "Add Food"}
          </button>

        </div>
        {message && (
          <p className="text-green-600 mt-3 text-center font-medium">{message}</p>
        )}
      </form>
    </div >
  );
};
