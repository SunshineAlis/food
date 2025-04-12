import React, { useState, useRef } from "react";
import axios from "axios";
import { useCategoryContext } from "../../Provider/CategoryProvider";
import { FaTrashCan } from "react-icons/fa6";
import { ImageUploader } from "./ImageUpload";
export const EditFood = ({ editingFood, setEditingFood }: EditFoodProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(editingFood.imageUrl || null);
  const { updateFoodInCategory, refetch, deleteFoodFromCategory } = useCategoryContext();
  const [message, setMessage] = useState<string | null>(null);
  const API_URL = "https://service-jus0.onrender.com";
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setEditingFood({
        ...editingFood,
        image: file,
      });
      setImagePreview(URL.createObjectURL(file));
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("foodName", editingFood.foodName);
      formData.append("price", String(editingFood.price));
      formData.append("ingredients", editingFood.ingredients);
      formData.append("categoryId", editingFood.categoryId || "");
      if (editingFood.image) {
        formData.append("image", editingFood.image);
      }

      await axios.put(`${API_URL}/foods/${editingFood._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      updateFoodInCategory(editingFood);
      refetch();
      setMessage("Food successfully updated!");
      setTimeout(() => {
        setMessage(null);
        setEditingFood(null);
      }, 2000);
    } catch (error) {
      setMessage("Error updating food. Please try again!");
      setTimeout(() => setMessage(null), 2000);
    }
  };
  const handleDelete = async () => {
    try {
      if (editingFood && editingFood._id) {
        await axios.delete(`${API_URL}/foods/${editingFood._id}`);
        deleteFoodFromCategory(editingFood._id, editingFood.categoryId || "");
        refetch();
        setMessage("Food successfully deleted!");
        setTimeout(() => {
          setMessage(null);
          setEditingFood(null);
        }, 1000);
      }
    } catch (error) {
      setMessage("Error deleting food. Please try again!");
      setTimeout(() => setMessage(null), 2000);
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full md:w-[60%] lg:w-[40%] max-h-[90vh] overflow-y-auto shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-center">Edit Food</h3>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="w-2/3">
                <label htmlFor="foodName" className="block text-sm font-medium text-gray-700">
                  Food Name
                </label>
                <textarea
                  id="foodName"
                  value={editingFood.foodName}
                  onChange={(e) =>
                    setEditingFood({
                      ...editingFood,
                      foodName: e.target.value,
                    })
                  }
                  rows={1}
                  className="border p-2 w-full rounded-md resize-none overflow-hidden"
                />
              </div>
              <input
                id="price"
                type="number"
                value={isNaN(editingFood.price) ? '' : editingFood.price}
                onChange={(e) =>
                  setEditingFood({
                    ...editingFood,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                className="border p-2 w-full rounded-md text-center"
              />
            </div>
            <div>
              <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700">
                Ingredients
              </label>
              <textarea
                id="ingredients"
                value={editingFood.ingredients}
                onChange={(e) =>
                  setEditingFood({
                    ...editingFood,
                    ingredients: e.target.value,
                  })
                }
                className="border px-2 w-full rounded-md"
                rows={4}
              />
            </div>
            <ImageUploader
              imagePreview={imagePreview}
              handleImageChange={handleImageChange}
            />
            <div className="flex justify-center gap-4 mt-4">
              <button type="button" onClick={handleDelete} className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600">
                <FaTrashCan />
              </button>
              <button type="submit" className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
                Save
              </button>
            </div>
          </div>
          {message && (
            <p className="text-green-600 mt-3 text-center font-medium">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
};
