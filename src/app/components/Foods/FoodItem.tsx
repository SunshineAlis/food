import React from "react";
import { PenIcon } from "lucide-react";

const FoodItem: React.FC<FoodItemProps> = ({ food, onEdit, }) => {
    return (
        <div className="relative border border-gray-300 shadow-lg flex flex-col justify-center items-center rounded-xl bg-white p-4">
            {food.image && (
                <img
                    src={food.image as string}
                    alt={food.foodName}
                    className="h-36 w-[90%] object-cover rounded-lg"
                />
            )}
            <div className="flex justify-between items-center mt-3 w-full px-2">
                <span className="text-red-500 font-bold truncate w-[70%] overflow-hidden hover:whitespace-normal hover:bg-white hover:shadow-md px-2 py-1 rounded-md">
                    {food.foodName}
                </span>
                <span className="text-gray-700 font-semibold">{food.price}₮</span>
            </div>
            <p className="font-bold w-full mt-2 px-2">
                Ingredients:
                <span className="font-normal block text-gray-600 text-sm overflow-hidden max-h-[3.5rem] transition-all duration-300 ease-in-out hover:max-h-[500px] hover:bg-gray-100 px-2 py-1 rounded-md">
                    {food.ingredients}
                </span>
            </p>
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
