import React from "react";
import axios from "axios";
import { Dispatch, useState } from "react";
import { SetStateAction } from "react";
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
    setEditingFood: Dispatch<SetStateAction<Food | null>>;
};

export const EditFood = ({ editingFood, setEditingFood }: EditFoodProps) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChangeEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            setEditingFood({
                ...editingFood!,
                image: file,
            });
            setImagePreview(URL.createObjectURL(file)); // 
        }
    };

    const handleUpdate = async (updatedFood: Food) => {
        try {
            const formData = new FormData();
            formData.append("foodName", editingFood.foodName);
            formData.append("price", String(editingFood.price));
            formData.append("ingredients", editingFood.ingredients);
            formData.append("categoryId", editingFood.categoryId as string);

            if (editingFood.image) {
                formData.append("image", editingFood.image);
            }

            await axios.put(
                `http://localhost:3030/foods/${updatedFood._id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            setEditingFood(null);
            setImagePreview(null);
        } catch (error) {
            console.error("Error updating food:", error);
        }
    };
    return (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center gap-2 w-full z-100">
            <div className="bg-white p-6 rounded-lg w-[90%] md:w-[60%] lg:w-[40%]">
                <h3 className="text-lg font-semibold">Edit Food</h3>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdate(editingFood);
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
                        className="border px-8 rounded mb-4"
                    />
                    <div className="flex justify-center">
                        <button type="submit" className="bg-blue-500 text-white p-2">
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
    );
};
