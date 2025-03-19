"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import FoodCategory from "@/app/components/FoodCategory";
import Foods from "@/app/components/Foods";


export default function Page() {

  return (
    <div className="p-4">
      <FoodCategory
      />
      <Foods />
    </div>
  );
}