"use client";
import { useState, useEffect } from "react";
import axios from "axios";

import Foods from "@/app/components/Foods";
import Left from "./components/Left";

import Categories from "./components/Categories";

export default function Page() {
  return (
    <div className="p-4 w-[100%] m-auto max-w-[1200px]">
      <div className="p-4 flex w-[100%] m-auto max-w-[1200px]">
        <Left />
        <div>
          <Categories />
          <Foods />
        </div>
      </div>
    </div>
  );
}
