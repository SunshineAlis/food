"use client";
import * as React from "react";

export default function ({ className = "" }) {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex w-full sm:w-[30%]">
        <img
          src="foodDeliver.webp"
          className="rounded-xl w-full h-auto"
          alt="Food Delivery"
        />
      </div>
      <div className="mx-2 py-2 flex flex-col justify-center">
        <p className="font-bold text-2xl">NomNom</p>
        <p className="italic">Swift delivery</p>
      </div>
    </div>
  );
}
