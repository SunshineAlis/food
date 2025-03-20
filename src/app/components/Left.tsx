import * as React from "react";
import {
  Settings,
  SquareMenuIcon,
  Truck,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Left() {
  const router = useRouter()

  return (
    <div className="w-[20%] h-full flex flex-col items-center cursor-pointer"
    >
      <div className="flex items-center">
        <div className="flex w-[30%]">
          <p>
            <img
              src="foodDeliver.webp"
              className="rounded-xl"
              alt="Food Delivery"
            />
          </p>
        </div>
        <div className="mx-2 py-2">
          <p className="font-bold text-2xl">NomNom</p>
          <p className="italic">Swift delivery</p>
        </div>
      </div>
      <div className="flex gap-2 mt-10 py-3 w-[90%] px-4 rounded-xl hover:bg-gray-800 hover:text-white hover:stroke-white"
        onClick={() => router.push('/FoodMenu')}>
        <SquareMenuIcon className="hover:stroke-white" />
        <p>Food Menu</p>
      </div>
      <div className="group flex gap-2 mt-2 py-3 w-[90%] px-4 rounded-xl hover:bg-gray-800 hover:text-white"
        onClick={() => router.push('/Orders')}>
        <Truck className="stroke-black group-hover:stroke-white" />
        <span>Orders</span>
      </div>

      <div className="group flex gap-2 mt-2 py-3 w-[90%] px-4 rounded-xl hover:bg-gray-800 hover:text-white">
        <Settings className="stroke-black group-hover:stroke-white" />
        <span>Settings</span>
      </div>
    </div >
  );
}
