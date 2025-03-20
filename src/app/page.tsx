"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import FoodCategory from "@/app/components/FoodCategory";
import Foods from "@/app/components/Foods";
import Left from "./components/Left";
import FoodClient from "./components/FoodClient";
import ClientHeader from "./components/ClientHeader";

export default function Page() {
  return (
    <div className="p-4 w-[100%] m-auto max-w-[1200px]">
      <ClientHeader />
      <div className="p-4 flex w-[100%] m-auto max-w-[1200px]">
        <Left />
        <div>
          <FoodClient />
        </div>
      </div>
    </div>
  );
}
