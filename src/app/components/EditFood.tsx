import React, { useState, useRef } from "react";
import axios from "axios";
import { useCategoryContext } from "../Provider/CategoryProvider";
import { FaTrashCan } from "react-icons/fa6";

type Food = {
  _id: string;
  foodName: string;
  price: number;
  ingredients: string;
  image?: string | null | File;
  categoryId?: string;
  imageUrl?: string;
};

type EditFoodProps = {
  editingFood: Food;
  setEditingFood: React.Dispatch<React.SetStateAction<Food | null>>;
};

export const EditFood = ({ editingFood, setEditingFood }: EditFoodProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(editingFood.imageUrl || null);
  const { updateFoodInCategory, refetch, deleteFoodFromCategory } = useCategoryContext();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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

      await axios.put(`http://localhost:3030/foods/${editingFood._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      updateFoodInCategory(editingFood);
      refetch();
      setEditingFood(null);
    } catch (error) {
      console.error("Error editing food:", error);
    }
  };

  const handleDelete = async () => {
    try {
      if (editingFood && editingFood._id) {
        await axios.delete(`http://localhost:3030/foods/${editingFood._id}`);
        deleteFoodFromCategory(editingFood._id, editingFood.categoryId || "");
        refetch();
        setEditingFood(null);
      }
    } catch (error) {
      console.error("Error deleting food:", error);
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
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = "40px";
                    target.style.height = `${target.scrollHeight}px`;
                  }}
                  rows={1}
                  className="border p-2 w-full rounded-md resize-none overflow-hidden"
                  style={{ minHeight: "40px", maxHeight: "140px", lineHeight: "1.5rem" }}
                />
              </div>

              <div className="w-1/3">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  id="price"
                  type="number"
                  value={editingFood.price}
                  onChange={(e) =>
                    setEditingFood({
                      ...editingFood,
                      price: parseFloat(e.target.value),
                    })
                  }
                  className="border p-2 w-full rounded-md text-center"
                />
              </div>
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
              />
            </div>

            <div className="relative">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Upload Image
              </label>
              <div className="flex flex-col items-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {imagePreview ? (
                  <div className="flex border rounded-xl cursor-pointer" onClick={handleImageClick}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-[400px] h-60 object-cover rounded-xl"
                    />
                  </div>
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border px-2 py-1 rounded-md"
                  />
                )}
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-4">
              <button type="button" onClick={handleDelete} className="bg-red-500 text-white p-2 rounded-md">
                <FaTrashCan />
              </button>
              <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">Save</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
