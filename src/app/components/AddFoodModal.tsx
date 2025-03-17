"use client";
import { useState } from "react";
import axios from "axios";

type AddFoodModalProps = {
  selectedCategory: string | null;
  onClose: () => void;
  onAddFood: (newFood: Food) => void;
  setSuccessMessage: (message: string) => void;
};

type Food = {
  _id: string;
  foodName: string;
  price: number;
  ingredients: string;
  image?: string;
  categoryId: string;
};

export default function AddFoodModal({
  selectedCategory,
  onClose,
  onAddFood,
  setSuccessMessage,
}: AddFoodModalProps) {
  const [newFood, setNewFood] = useState({
    foodName: "",
    price: 0,
    ingredients: "",
    image: null as File | null,
    imageUrl: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmitFood = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedCategory) return alert("Please select a category first!");
    if (
      !newFood.foodName ||
      !newFood.price ||
      isNaN(newFood.price) ||
      !newFood.ingredients ||
      !newFood.image
    ) {
      return alert("Please fill out all fields and upload an image!");
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", newFood.image);
      formData.append("upload_preset", "your_upload_preset");

      const cloudinaryResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload",
        formData
      );

      const imageUrl = cloudinaryResponse.data.secure_url;
      const response = await axios.post("http://localhost:3030/foods", {
        foodName: newFood.foodName,
        price: newFood.price,
        ingredients: newFood.ingredients,
        categoryId: selectedCategory,
        image: imageUrl,
      });

      if (onAddFood) {
        onAddFood(response.data.food);
      }

      setNewFood({
        foodName: "",
        price: 0,
        ingredients: "",
        image: null,
        imageUrl: "",
      });

      setSuccessMessage("Food added successfully!");
      onClose();
    } catch (error) {
      console.error("Error adding food:", error);
      setSuccessMessage("Error adding food. Please try again.");
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
        imageUrl: URL.createObjectURL(file),
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-300 bg-opacity-20 flex items-center justify-center z-10 backdrop-blur-md">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[440px]">
        <h2 className="text-xl font-semibold mb-4">Add Food</h2>
        <form onSubmit={handleSubmitFood} className="flex flex-col gap-2 ">
          <div className="flex gap-2 justify-between">
            <input
              type="text"
              name="foodName"
              value={newFood.foodName}
              onChange={(e) =>
                setNewFood({ ...newFood, foodName: e.target.value })
              }
              placeholder="Food Name"
              className="border p-2 w-50 rounded"
              required
            />
            <input
              type="number"
              name="price"
              value={isNaN(newFood.price) ? 0 : newFood.price} // Ensure it's a valid number or fallback to 0
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                setNewFood({ ...newFood, price: isNaN(value) ? 0 : value }); // Ensure it's parsed as a number
              }}
              placeholder="Food Price"
              className="border p-2 w-44 rounded"
              required
            />
          </div>

          <input
            type="text"
            name="ingredients"
            value={newFood.ingredients}
            onChange={(e) =>
              setNewFood({ ...newFood, ingredients: e.target.value })
            }
            placeholder="Ingredients"
            className="border p-2 rounded"
            required
          />

          {newFood.imageUrl ? (
            <div className="mt-4 flex justify-center border">
              <img
                src={newFood.imageUrl}
                alt="Preview"
                className="w-[90%] object-cover rounded"
              />
            </div>
          ) : (
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              className="border p-2 rounded"
              required
            />
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-2 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
