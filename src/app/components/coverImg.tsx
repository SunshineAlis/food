"use client";

import { useState } from "react";

type CoverImgProps = {
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

export const CoverImg: React.FC<CoverImgProps> = ({ handleImageChange, className = "" }) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    return (
        <div className={`mb-6 ${className}`}>
            <label className="block mb-2 font-medium">Select cover image:</label>

            {previewUrl && (
                <div className="mb-4">
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-40 rounded-md"
                    />
                </div>
            )}

            <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                    handleImageChange(e);
                    const file = e.target.files?.[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            setPreviewUrl(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                    }
                }}
                className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
            />
        </div>
    );
};
