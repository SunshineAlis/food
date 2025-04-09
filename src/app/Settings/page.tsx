"use client";
import { useState } from "react";
import axios from "axios";
import { CoverImg } from "../components/coverImg";

export default function AdminPage() {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [selectedPages, setSelectedPages] = useState<string[]>([]);
    const [selectionMode, setSelectionMode] = useState<"highlight" | "tags">("tags"); // Default to "tags"
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const handlePageSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (selectedPages.includes(value)) {
            setSelectedPages(selectedPages.filter((page) => page !== value));
        } else {
            setSelectedPages([...selectedPages, value]);
        }
    };
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            setSelectedImage(null);
            setPreviewUrl(null);
            return;
        }
        const file = e.target.files[0];
        if (!file.type.match('image.*')) {
            alert('Please select an image file (jpg, png, etc.)');
            return;
        }
        setSelectedImage(file);
        const reader = new FileReader();
        reader.onload = (event) => {
            setPreviewUrl(event.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleImageUpload = async () => {
        if (!selectedImage) {
            alert("Please select an image first.");
            return;
        }
        if (selectedPages.length === 0) {
            alert("Please select at least one page.");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("cover", selectedImage);
        formData.append("page", selectedPages.join(","));

        console.log("Uploading with formData:", formData);

        try {
            const response = await axios.post("http://localhost:3030/img", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Upload response:", response.data);
            alert(`Image updated successfully! URL: ${response.data.url}`);

            // Refresh pages
            await Promise.all(selectedPages.map(page =>
                axios.get(`http://localhost:3030/img/${page}?t=${Date.now()}`)
            ));

        } catch (error: any) {
            console.error("Error uploading image:", error);
            alert(error.response?.data?.error || "Error uploading image.");
        } finally {
            setUploading(false);
        }
    };


    const removePage = (pageToRemove: string) => {
        setSelectedPages(selectedPages.filter(page => page !== pageToRemove));
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Change Cover Image</h1>
            <div className="mb-6">
                <label className="block mb-2 font-medium">Select Pages to Update:</label>
                <select
                    multiple
                    value={selectedPages}
                    onChange={handlePageSelection}
                    className={`w-full p-2 border rounded ${selectionMode === "highlight" ? "h-40" : ""}`}
                >
                    {["FoodClient", "Login", "Password", "sign-up", "Settings", "forgotPassword"].map(page => (
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

            <CoverImg handleImageChange={handleImageChange} />
            <button
                onClick={handleImageUpload}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                disabled={!selectedImage || selectedPages.length === 0 || uploading}
            >
                {uploading ? "Uploading..." : "Upload Image"}
            </button>
        </div >
    );
}
