"use client";
import { useState } from "react";
import axios from "axios";

export default function AdminPage() {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [selectedPages, setSelectedPages] = useState<string[]>([]);
    const [selectionMode, setSelectionMode] = useState<"highlight" | "tags">("highlight");

    const handlePageSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (selectedPages.includes(value)) {
            setSelectedPages(selectedPages.filter((page) => page !== value));
        } else {
            setSelectedPages([...selectedPages, value]);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            setSelectedImage(file);
        }
    };

    const handleImageUpload = async () => {
        if (!selectedImage) {
            alert("Please select an image first.");
            return;
        }

        const formData = new FormData();
        formData.append("cover", selectedImage);
        formData.append("page", selectedPages.join(","));

        try {
            const response = await axios.post("http://localhost:3030/img", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Image uploaded successfully:", response.data);
            alert("Image updated successfully!");
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Error uploading image.");
        }
    };

    const removePage = (pageToRemove: string) => {
        setSelectedPages(selectedPages.filter(page => page !== pageToRemove));
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Change Cover Image for Multiple Pages</h1>

            <div className="mb-6">
                <label className="block mb-2 font-medium">Selection Display Mode:</label>
                <div className="flex gap-4">
                    <button
                        className={`px-4 py-2 rounded ${selectionMode === "highlight" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                        onClick={() => setSelectionMode("highlight")}
                    >
                        Highlight Mode
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${selectionMode === "tags" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                        onClick={() => setSelectionMode("tags")}
                    >
                        Tag Mode
                    </button>
                </div>
            </div>

            <div className="mb-6">
                <label className="block mb-2 font-medium">Select Pages to Update:</label>
                <select
                    multiple
                    value={selectedPages}
                    onChange={handlePageSelection}
                    className={`w-full p-2 border rounded ${selectionMode === "highlight" ? "h-40" : ""}`}
                    style={selectionMode === "highlight" ? {
                        backgroundColor: "#f8fafc",
                    } : {}}
                >
                    {["FoodClient", "Login", "Password", "sign-up", "forgotPassword"].map(page => (
                        <option
                            key={page}
                            value={page}
                            style={selectionMode === "highlight" && selectedPages.includes(page) ? {
                                backgroundColor: "#93c5fd",
                                color: "#1e3a8a",
                            } : {}}
                        >
                            {page}
                        </option>
                    ))}
                </select>

                {selectionMode === "tags" && selectedPages.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {selectedPages.map(page => (
                            <span
                                key={page}
                                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center"
                            >
                                {page}
                                <button
                                    onClick={() => removePage(page)}
                                    className="ml-2 text-blue-500 hover:text-blue-700"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="mb-6">
                <label className="block mb-2 font-medium">Select cover image:</label>
                <input
                    type="file"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
            </div>

            <button
                onClick={handleImageUpload}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                disabled={!selectedImage || selectedPages.length === 0}
            >
                Upload Image
            </button>
        </div>
    );
}