import React from "react";
import { PenIcon } from "lucide-react";

type Food = {
    _id: string;
    foodName: string;
    price: number;
    ingredients: string;
    image?: string | null | File;
    categoryId?: string;
    imageUrl?: string;
};

type FoodItemProps = {
    food: Food;
    onEdit: () => void;
    onDelete?: () => void;
};

const FoodItem: React.FC<FoodItemProps> = ({ food, onEdit, onDelete }) => {
    return (
        <div className="border p-2 border-gray-400 rounded-lg bg-white h-full relative">
            {food.image && (
                <img
                    src={food.image as string}
                    alt={food.foodName}
                    className="h-30 w-full object-cover rounded-md"
                />
            )}
            <div className="flex flex-col justify-between items-start mt-2 relative">
                <div className="flex justify-between w-full">
                    <p
                        className="text-red-500 font-bold text-start truncate w-[75%]"
                        title={food.foodName}
                    >
                        {food.foodName}
                    </p>
                    <p className="text-gray-700">{food.price}₮</p>
                </div>

                <p className="font-bold">
                    Ingredients:
                    <span className="font-normal pl-2 text-wrap h-20">{food.ingredients}</span>
                </p>
            </div>

            <button
                className="absolute top-2 right-6 p-1 bg-white rounded-full shadow"
                onClick={onEdit}
            >
                <PenIcon className="text-red-500 w-5 h-5" />
            </button>
        </div>
    );
};

export default FoodItem;
