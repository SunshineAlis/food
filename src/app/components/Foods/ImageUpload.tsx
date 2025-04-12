"use client"
import React, { useRef } from "react";
export const ImageUploader = ({
    imagePreview,
    handleImageChange,
}: ImageUploaderProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleImageClick = () => {
        fileInputRef.current?.click();
    };
    return (
        <div className="relative">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                Image
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
                            className="w-full h-70 object-cover rounded-xl"
                        />
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={handleImageClick}
                        className=" w-full  h-full px-4 py-2 bg-gray-100 border rounded-md"
                    >
                        Select Image
                    </button>
                )}
            </div>
        </div>
    );
};
