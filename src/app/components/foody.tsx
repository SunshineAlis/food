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
  image?: string | null | File;
  categoryId?: string;
  imageUrl?: string;
};

export default function FoodsByCategory({
  onAddFood,
}: {
  onAddFood: () => void;
}) {
  const [categoriesWithFoods, setCategoriesWithFoods] = useState<Category[]>([]);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAddFoodModal, setShowAddFoodModal] = useState(false);
  const [newFood, setNewFood] = useState<Omit<Food, "_id">>({
    foodName: "",
    price: 0,
    ingredients: "",
    image: null,
    imageUrl: "",
    categoryId: undefined,
  });
  const [loading, setLoading] = useState(false);

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
    setImagePreview(food.image as string);
  };

  const handleSave = async (updatedFood: Food) => {
    try {
      await axios.put(
        `http://localhost:3030/foods/${updatedFood._id}`,
        updatedFood
      );
      setEditingFood(null);
      setDropdown(null);
      setImagePreview(null);
      const updatedCategories = categoriesWithFoods.map((category) => ({
        ...category,
        foods: category.foods?.map((food) =>
          food._id === updatedFood._id ? updatedFood : food
        ),
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
      const updatedCategories = categoriesWithFoods.map((category) => ({
        ...category,
        foods: category.foods?.filter((food) => food._id !== foodId),
      }));
      setCategoriesWithFoods(updatedCategories);
    } catch (error) {
      console.error("Error deleting food:", error);
    }
  };

  const handleAddFood = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("foodName", newFood.foodName);
    formData.append("price", String(newFood.price));
    formData.append("ingredients", newFood.ingredients);
    if (newFood.image) {
      formData.append("image", newFood.image);
    }
    formData.append("categoryId", selectedCategory as string);

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
      const addedFood = response.data;
      const updatedCategories = categoriesWithFoods.map((category) => {
        if (category._id === selectedCategory) {
          return {
            ...category,
            foods: [...(category.foods || []), addedFood],
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
        image: null,
        imageUrl: "",
      });
    } catch (error) {
      console.error("Error adding food:", error);
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

  const handleImageChangeEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setEditingFood({
        ...editingFood!,
        image: file,
      });
      setImagePreview(URL.createObjectURL(file)); // Update the image preview
    }
  };

  const handleSubmitFood = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddFood();
  };

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
              <div className="h-60 w-full border border-red-500 rounded-xl flex justify-center items-center">
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
                  <div
                    key={food._id}
                    className="relative p-2 border rounded-lg bg-white"
                  >
                    {food.image && (
                      <img
                        src={food.image as string}
                        alt={food.foodName}
                        className="h-24 w-full object-cover rounded-md"
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
                      <div className="absolute top-8 right-0 bg-white shadow-lg rounded-lg p-2 w-40 cursor-pointer">
                        <button
                          className="block px-3 py-1 text-blue-500 hover:bg-gray-100 w-full text-left"
                          onClick={() => handleEdit(food)}
                        >
                          Edit
                        </button>

                        {editingFood && (
                          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center gap-2 w-full z-100">
                            <div className="bg-white p-6 rounded-lg w-[90%] md:w-[60%] lg:w-[40%]">
                              <h3 className="text-lg font-semibold">
                                Edit Food
                              </h3>
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  handleSave(editingFood);
                                }}
                              >
                                <div className="flex gap-2 justify-between">
                                  <input
                                    type="text"
                                    value={editingFood.foodName}
                                    onChange={(e) =>
                                      setEditingFood({
                                        ...editingFood,
                                        foodName: e.target.value,
                                      })
                                    }
                                    className="border p-2 w-full mb-2"
                                  />
                                  <input
                                    type="number"
                                    value={editingFood.price}
                                    onChange={(e) =>
                                      setEditingFood({
                                        ...editingFood,
                                        price: parseFloat(e.target.value),
                                      })
                                    }
                                    className="border p-2 w-full mb-2"
                                  />
                                </div>
                                <textarea
                                  value={editingFood.ingredients}
                                  onChange={(e) =>
                                    setEditingFood({
                                      ...editingFood,
                                      ingredients: e.target.value,
                                    })
                                  }
                                  className="border p-2 w-full mb-2"
                                />
                                {imagePreview && (
                                  <div className="mt-4 flex justify-center border">
                                    <img
                                      src={imagePreview}
                                      alt="Preview"
                                      className="w-50 object-cover rounded"
                                    />
                                  </div>
                                )}
                                <input
                                  type="file"
                                  name="image"
                                  onChange={handleImageChangeEdit}
                                  placeholder="Food Image"
                                  className="border p-2  px-20 rounded mb-4"
                                />
                                <div className="flex justify-center">
                                  <button
                                    type="submit"
                                    className="bg-blue-500 text-white p-2"
                                  >
                                    Save
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setEditingFood(null)}
                                    className="bg-gray-500 text-white p-2 ml-2"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        )}

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
          <form
            onSubmit={handleSubmitFood}
            className="flex flex-col gap-3 bg-white p-6 rounded-lg shadow-lg w-1/3"
          >
            <h2 className="text-lg font-semibold mb-4">Add Food</h2>
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
                className="w-full border px-2 py-1 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="price" className="block text-sm text-gray-700">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={isNaN(newFood.price) ? 0 : newFood.price}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  setNewFood({ ...newFood, price: isNaN(value) ? 0 : value });
                }}
                placeholder="Food Price"
                className="border p-2 w-44 rounded"
                required
              />
            </div>
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
                  src={newFood.image as string}
                  alt="Preview"
                  className="mt-2 h-32 w-32 object-cover"
                />
              )}
            </div>
            <div className="flex justify-between items-center">
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
      )}
    </div>
  );
}
