"use client";
import { useState } from "react";
import axios from "axios";
import { useCategoryContext } from "../Provider/CategoryProvider";


type Category = {
  foodCount: number;
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

const Categories = () => {
  const [dropdown, setDropdown] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState<{ categoryName: string }>({ categoryName: "" });
  const [loading, setLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { categories, addCategory, updateCategory, deleteCategory, refetch } = useCategoryContext();
  const allFoods = categories.flatMap((cat) => cat.foods || []);
  const allFoodsCount = allFoods.length;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (editingCategory) {
        await axios.put(`http://localhost:3030/category/${editingCategory._id}`, {
          categoryName: category.categoryName,
        });
        updateCategory({ ...editingCategory, categoryName: category.categoryName });
      } else {
        const response = await axios.post("http://localhost:3030/category", {
          categoryName: category.categoryName,
        });
        addCategory(response.data);
      }
      setCategory({ categoryName: "" });
      setShowModal(false);
      setEditingCategory(null);
      refetch();
    } catch (error) {
      console.error("Error uploading category:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (catId: string) => {
    try {
      await axios.delete(`http://localhost:3030/category/${catId}`);
      deleteCategory(catId);
      refetch();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="p-4 bg-gray-100 max-w-[900px] w-full m-auto rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Dishes Category</h3>
      <div className="flex flex-wrap gap-3 items-center">
        <p className="px-3 py-1 rounded-lg cursor-pointer bg-gray-200 hover:bg-gray-300 transition">
          All Dishes <span className="px-2">({allFoodsCount})</span>
        </p>

        {categories.map((cat) => (
          <div key={cat._id} className="relative">
            <span
              onClick={() => setDropdown(dropdown === cat._id ? null : cat._id)}
              className="px-3 py-1 rounded-lg cursor-pointer bg-gray-200 hover:bg-gray-300 transition"
            >
              {cat.categoryName} ({cat.foodCount || 0})
            </span>

            {dropdown === cat._id && (
              <div key={`${cat._id}-dropdown`} className="absolute bg-white shadow-lg rounded-lg p-2 mt-1 w-40 z-10">
                <button
                  className="block px-3 py-1 text-blue-500 hover:bg-gray-100 w-full text-left"
                  onClick={() => {
                    setEditingCategory(cat);
                    setCategory({ categoryName: cat.categoryName });
                    setShowModal(true);
                    setDropdown(null);
                  }}
                >
                  Edit
                </button>
                <button
                  className="block px-3 py-1 text-red-500 hover:bg-gray-100 w-full text-left"
                  onClick={() => handleDelete(cat._id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
        <button
          onClick={() => {
            setEditingCategory(null);
            setCategory({ categoryName: "" });
            setShowModal(true);
          }}
          className="bg-red-500 text-white px-4 py-2 rounded-full text-lg"
        >
          +
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">
              {editingCategory ? "Edit Category" : "Add Category"}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="categoryName"
                value={category.categoryName}
                onChange={(e) => setCategory({ categoryName: e.target.value })}
                placeholder="Category Name"
                className="border p-2 rounded"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  {loading ? (editingCategory ? "Updating..." : "Adding...") : editingCategory ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
