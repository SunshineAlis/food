"use client";
import { RenderCategory } from "./RenderCategory";

const Categories = () => {

  return (
    <div className="p-4 bg-gray-100 max-w-[900px] w-full mx-auto rounded-lg">
      <h3 className="text-lg font-semibold mb-2 text-center sm:text-left">
        Dishes Category
      </h3>
      <div className="flex gap-2 sm:gap-3 items-center justify-center sm:justify-start">
        <RenderCategory />
      </div>
    </div>

  );
};

export default Categories;
