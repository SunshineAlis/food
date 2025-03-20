"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Logo from "./Logo";
import { IoLocationOutline } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import { SlBasket } from "react-icons/sl";
import { GoPerson } from "react-icons/go";

export default function ClientHeader() {
  return (
    <div className="flex w-[100%]  m-auto max-w-[1200px] bg-black">
      <div className="flex items-center justify-between  ">
        <Logo className="w-[20%] sm:w-[20%] text-white" />
        {/* deliver location */}
        <div className="flex w-[50%] justify-around">
          <div className="bg-white h-10 flex  max-w-[320px] w-[100%] sm:w-[80%] m-auto items-center text-black rounded-2xl relative">
            <div className="flex justify-center items-center ml-2">
              <IoLocationOutline className="text-xl text-red-500 md:text-xl ml-1 lg:text-xl" />
              <p className="text-sm w-[120px] text-red-600">
                Delivery address:
              </p>
            </div>
            <div className="flex justify-center items-center w-full absolute left-26">
              <input
                className="text-black w-[70%] mr-8 pr-4 px-4 py-1 rounded-2xl border-none focus:outline-none focus:border-none"
                placeholder="Add Location"
              />
              <IoIosArrowForward className="absolute left-40 top-1/2 transform -translate-y-1/2 text-xl" />
            </div>
          </div>

          {/* basket */}
          <div className="text-black bg-white rounded-full h-10 w-10 flex justify-center items-center ">
            <SlBasket className="z-10 " />
          </div>

          <div className="text-white flex items-center justify-center bg-red-500 w-10 h-10 rounded-full">
            <GoPerson />
          </div>
        </div>
      </div>
    </div>
  );
}
