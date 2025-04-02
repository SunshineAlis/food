// "use client";
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { PenIcon } from "lucide-react";
// import { AddFood } from "../addFood";
// import { EditFood } from "../EditFood";
// import { useRouter } from "next/navigation";
// import { useCategoryContext } from ""
// type Food = {
//   _id: string;
//   foodName: string;
//   price: number;
//   ingredients: string;
//   image?: string | null | File;
//   categoryId?: string;
//   imageUrl?: string;
// };

// export default function Foods() {
//   const {
//     categories,
//     deleteFoodFromCategory,
//     refetch,
//   } = useCategoryContext();
//   const [selectedFood, setSelectedFood] = useState<Food | null>(null);
//   const [editingFood, setEditingFood] = useState<Food | null>(null);
//   const [dropdown, setDropdown] = useState<string | null>(null);
//   const [showAddFoodModal, setShowAddFoodModal] = useState(false);

//   const router = useRouter();
//   const handleEdit = (food: Food) => {
//     setEditingFood(food);
//   };

//   const handleDelete = async (foodId: string) => {
//     try {
//       await axios.delete(`http://localhost:3030/foods/${foodId}`);

//       deleteFoodFromCategory(foodId, selectedFood?.categoryId || '');
//       refetch();

//     } catch (error) {
//       console.error("Error deleting food:", error);
//     }
//   };


//   const dropdownMenu = (food: Food) => {
//     setDropdown(dropdown === food._id ? null : food._id);
//   };

//   const allFoods = categories.flatMap((category) => category.foods || []);
//   const displayedFoods = allFoods.slice(0, 3);

//   return (
//     <div className="p-4 bg-gray-100 max-w-[900px] w-full m-auto rounded-2xl">
//       <h2 className="text-xl font-bold mb-4">Foods by Category</h2>
//       <div className="flex justify-between items-center">
//         <h3 className="text-lg font-semibold mb-2">All Dishes</h3>
//         <button
//           className="text-blue-500 underline py-2 cursor-pointer"
//           onClick={() => router.push("/all-dishes")}
//         >
//           See All
//         </button>
//       </div>
//       <div className="grid grid-cols-4 gap-2">
//         <div className="h-70 w-full border border-red-500 rounded-xl flex justify-center items-center">
//           <div className="flex flex-col justify-center items-center">
//             <button
//               onClick={() => {
//                 setShowAddFoodModal(true);
//               }}
//               className="bg-red-500 w-10 h-10 rounded-full text-white text-4xl"
//             >
//               +
//             </button>
//             <p className="text-black w-[70%] text-center mt-4">
//               Add new Dish to Appetizers
//             </p>
//           </div>
//         </div>
//         {displayedFoods.map((food) => (
//           <div
//             key={food._id}
//             className="relative p-2 border border-gray-400 rounded-lg bg-white"
//           >
//             {food.image && (
//               <img
//                 src={food.image as string}
//                 alt={food.foodName}
//                 className="h-30 w-full object-cover rounded-md"
//               />
//             )}
//             <div className="flex justify-between items-center mt-2">
//               <span className="text-red-500 font-bold text-start truncate w-[75%] hover:overflow-visible hover:h-full hover:whitespace-normal hover:bg-white ">
//                 {food.foodName}
//               </span>
//               <span className="text-gray-700">{food.price}₮</span>
//             </div>
//             <p className="font-bold ">
//               Ingredients:
//               <span className="font-normal pl-2 text-wrap h-25 hover:h-full">
//                 {food.ingredients}
//               </span>
//             </p>
//             <button
//               className="absolute top-15 right-4 p-3 bg-white cursor-pointer rounded-full shadow"
//               onClick={() => handleEdit(food)}
//             >
//               <PenIcon className="text-red-500 w-5 h-5" />
//             </button>
//           </div>
//         ))}
//       </div>

//       {categories.map((category) => (
//         <div key={category._id} className="mb-6">
//           <div className="flex justify-between">
//             <h3 className="text-lg font-semibold mb-2">{category.categoryName} ({category.foodCount || 0})</h3>
//           </div>
//           <div className="grid grid-cols-4 gap-2">
//             {category.foods && category.foods.length > 0 ? (
//               category.foods.map((food) => (
//                 <div key={food._id} className="border p-2 border-gray-400 rounded-lg bg-white h-full relative">
//                   {food.image && (
//                     <img src={food.image as string} alt={food.foodName} className="h-30 w-full object-cover rounded-md" />
//                   )}
//                   <div className="flex flex-col justify-between items-start mt-2 relative">
//                     <div className="flex justify-between w-full">
//                       <p className="text-red-500 font-bold text-start truncate w-[75%]" title={food.foodName}>
//                         {food.foodName}
//                       </p>
//                       <p className="text-gray-700">{food.price}₮</p>
//                     </div>

//                     <p className="font-bold">
//                       Ingredients:
//                       <span className="font-normal pl-2 text-wrap h-20">{food.ingredients}</span>
//                     </p>
//                   </div>

//                   <button
//                     className="absolute top-2 right-6 p-1 bg-white rounded-full shadow"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       dropdownMenu(food);
//                     }}
//                   >
//                     <PenIcon className="text-red-500 w-5 h-5" />
//                   </button>

//                   {dropdown === food._id && (
//                     <div className="absolute top-8 right-0 bg-white shadow-lg rounded-lg p-2 w-40 cursor-pointer">
//                       <button
//                         className="block px-3 py-1 text-blue-500 hover:bg-gray-100 w-full text-left"
//                         onClick={() => handleEdit(food)}
//                       >
//                         Edit
//                       </button>
//                       <button
//                         className="block px-3 py-1 text-red-500 hover:bg-gray-100 w-full text-left"
//                         onClick={() => handleDelete(food._id)}
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               ))
//             ) : (
//               <p className="text-gray-500">No foods available</p>
//             )}
//           </div>
//         </div>
//       ))}
//       {showAddFoodModal && <AddFood setShowAddFoodModal={setShowAddFoodModal} />}
//       {editingFood && <EditFood editingFood={editingFood} setEditingFood={setEditingFood} />}
//     </div>
//   );
// }
