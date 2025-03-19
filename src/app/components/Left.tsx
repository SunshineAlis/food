import * as React from "react";
import MenuIcon from "../icon.svg/MenuIcon";
import OrderIcon from "../icon.svg/OrderIcon";
import {
  ListOrdered,
  LucideListOrdered,
  Menu,
  MenuSquareIcon,
  Settings,
  Settings2Icon,
  SettingsIcon,
  SquareMenuIcon,
  Truck,
} from "lucide-react";

export default function Left() {
  return (
    <div className="w-[20%] h-full flex flex-col items-center">
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
      <div className="flex gap-2 mt-10 py-3 w-[90%] px-4 rounded-xl hover:bg-gray-800 hover:text-white hover:stroke-white">
        <SquareMenuIcon className="hover:stroke-white" />
        <p>Food Menu</p>
      </div>
      <div className="group flex gap-2 mt-2 py-3 w-[90%] px-4 rounded-xl hover:bg-gray-800 hover:text-white">
        <Truck className="stroke-black group-hover:stroke-white" />
        <span>Orders</span>
      </div>

      <div className="group flex gap-2 mt-2 py-3 w-[90%] px-4 rounded-xl hover:bg-gray-800 hover:text-white">
        <Settings className="stroke-black group-hover:stroke-white" />
        <span>Settings</span>
      </div>
    </div>
  );
}
