"use client";
import { HoveredOrderProps } from "@/type";
import React from "react";

const HoveredOrder: React.FC<HoveredOrderProps> = ({ order }) => {
    return (
        <div className="absolute z-10 left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-3">
            <div className="space-y-3">
                {order.foodList.map((food, i) => (
                    <div key={i} className="flex items-start space-x-3">
                        <img
                            src={food.image}
                            alt={food.foodName}
                            className="w-12 h-12 object-cover rounded"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/placeholder-food.jpg";
                            }}
                        />
                        <div className="flex-1">
                            <p className="font-medium text-gray-800">{food.foodName}</p>
                            {food.categoryName && (
                                <p className="text-xs text-gray-500">{food.categoryName}</p>
                            )}
                            <div className="flex justify-between text-sm mt-1">
                                <span>
                                    {food.quantity} × ₮{food.unitPrice.toLocaleString()}
                                </span>
                                <span className="font-semibold">
                                    ₮{food.total.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
                <div className="border-t border-gray-200 pt-2 mt-2 text-right font-semibold">
                    Total: ₮{order.orderTotal.toLocaleString()}
                </div>
            </div>
        </div>
    );
};

export default HoveredOrder;
