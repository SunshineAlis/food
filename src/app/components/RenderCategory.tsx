"use client";
import { useState } from "react";
import { useCategoryContext } from "../Provider/CategoryProvider";
import axios from "axios";
export const RenderCategory = () => {
    const {
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        refetch,
    } = useCategoryContext();
    const [category, setCategory] = useState<{ categoryName: string }>({
        categoryName: "",
    });
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(false);
    const [dropdown, setDropdown] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const API_URL = "https://service-jus0.onrender.com";
    const allFoods = categories.flatMap((cat) => cat.foods || []);
    const allFoodsCount = allFoods.length;
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        try {
            if (editingCategory) {
                await axios.put(`${API_URL}/category/${editingCategory._id}`, {
                    categoryName: category.categoryName,
                });
                updateCategory({
                    ...editingCategory,
                    categoryName: category.categoryName,
                });
            } else {
                const response = await axios.post(`${API_URL}/category`, {
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
            await axios.delete(`${API_URL}/category/${catId}`);
            deleteCategory(catId);
            refetch();
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };
    return (
        <div className="">
            <div className="flex flex-wrap gap-2 sm:gap-3 items-center justify-center sm:justify-start m-auto">
                <p className="px-3 py-1 rounded-lg cursor-pointer bg-gray-200 hover:bg-gray-300 transition text-sm sm:text-base">
                    All Dishes <span className="px-2">({allFoodsCount})</span>
                </p>
                {categories.map((cat, index) => (
                    <div key={cat._id || index} className="relative">
                        <span
                            onClick={() =>
                                setDropdown(dropdown === cat._id ? null : cat._id)
                            }
                            className="px-3 py-1 rounded-lg cursor-pointer bg-gray-200 hover:bg-gray-300 transition text-sm sm:text-base whitespace-nowrap"
                        >
                            {cat.categoryName} ({cat.foodCount || 0})
                        </span>

                        {dropdown === cat._id && (
                            <div className="absolute bg-white shadow-lg rounded-lg p-2 mt-1 w-40 z-10">
                                <button
                                    className="block px-3 py-1 text-blue-500 hover:bg-gray-100 w-full text-left text-sm"
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
                                    className="block px-3 py-1 text-red-500 hover:bg-gray-100 w-full text-left text-sm"
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
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 p-4">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                            <h2 className="text-xl font-semibold mb-4 text-center sm:text-left">
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
                                <div className="flex flex-col sm:flex-row justify-end gap-2">
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
                                        {loading
                                            ? editingCategory
                                                ? "Updating..."
                                                : "Adding..."
                                            : editingCategory
                                                ? "Update"
                                                : "Add"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
};
