// import React, { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";

// type Order = {
//     orderItem: { food: [] },
//     user: user
//     status: string,

//     category
// };

// type Food = {
//     _id: string;
//     foodName: string;
//     price: number;
//     ingredients: string;
//     image?: string | null | File;
//     categoryId?: string;
//     imageUrl?: string;
// };

// type Category = {
//     foodCount: number;
//     _id: string;
//     categoryName: string;
//     foods?: Food[];
// };

// type CategoryContextType = {
//     categories: Category[];
//     loading: boolean;
//     error: string | null;
//     refetch: () => void;
//     addCategory: (newCategory: Category) => void;
//     updateCategory: (updatedCategory: Category) => void;
//     deleteCategory: (categoryId: string) => void;
//     addFoodToCategory: (newFood: Food) => void;
//     updateFoodInCategory: (updatedFood: Food) => void;
//     deleteFoodFromCategory: (foodId: string, categoryId: string) => void;
// };

// export const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

// export const useCategoryContext = () => {
//     const context = useContext(CategoryContext);
//     if (!context) {
//         throw new Error("useCategoryContext must be used within a CategoryProvider");
//     }
//     return context;
// };

// export const CategoryProvider = ({ children }: { children: React.ReactNode }) => {
//     const [categories, setCategories] = useState<Category[]>([]);
//     const [loading, setLoading] = useState<boolean>(false);
//     const [error, setError] = useState<string | null>(null);

//     const fetchData = async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await axios.get("http://localhost:3030/category");
//             const categoriesData = await Promise.all(
//                 response.data.data.map(async (category: Category) => {
//                     try {
//                         const foodResponse = await axios.get<{ foods: Food[] }>(
//                             `http://localhost:3030/foods/${category._id}/foods`
//                         );
//                         const foods = foodResponse.data.foods || [];
//                         return {
//                             ...category,
//                             foods,
//                             foodCount: foods.length,
//                         };
//                     } catch (error) {
//                         console.error(`Error fetching foods for category ${category._id}:`, error);
//                         return { ...category, foods: [], foodCount: 0 };
//                     }
//                 })
//             );
//             setCategories(categoriesData);
//         } catch (error) {
//             setError("Failed to load categories");
//             console.error(error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchData();
//     }, []);

//     const addCategory = (newCategory: Category) => {
//         setCategories((prevCategories) => [...prevCategories, newCategory]);
//     };

//     const updateCategory = (updatedCategory: Category) => {
//         setCategories((prevCategories) =>
//             prevCategories.map((category) =>
//                 category._id === updatedCategory._id ? { ...category, ...updatedCategory } : category
//             )
//         );
//     };

//     const deleteCategory = (categoryId: string) => {
//         setCategories((prevCategories) => prevCategories.filter((category) => category._id !== categoryId));
//     };

//     const addFoodToCategory = (newFood: Food) => {
//         setCategories((prevCategories) =>
//             prevCategories.map((category) =>
//                 category._id === newFood.categoryId
//                     ? {
//                         ...category,
//                         foods: [...(category.foods || []), newFood],
//                         foodCount: (category.foods?.length || 0) + 1,
//                     }
//                     : category
//             )
//         );
//     };

//     const updateFoodInCategory = (updatedFood: Food) => {
//         setCategories((prevCategories) =>
//             prevCategories.map((category) =>
//                 category._id === updatedFood.categoryId
//                     ? {
//                         ...category,
//                         foods: category.foods?.map((food) => (food._id === updatedFood._id ? updatedFood : food)) || [],
//                         foodCount: category.foods?.length || 0,
//                     }
//                     : category
//             )
//         );
//     };

//     const deleteFoodFromCategory = (foodId: string, categoryId: string) => {
//         setCategories((prevCategories) =>
//             prevCategories.map((category) =>
//                 category._id === categoryId
//                     ? {
//                         ...category,
//                         foods: category.foods?.filter((food) => food._id !== foodId) || [],
//                         foodCount: (category.foods?.length || 0) - 1,
//                     }
//                     : category
//             )
//         );
//     };

//     return (
//         <CategoryContext.Provider
//             value={{
//                 categories,
//                 loading,
//                 error,
//                 refetch: fetchData,
//                 addCategory,
//                 updateCategory,
//                 deleteCategory,
//                 addFoodToCategory,
//                 updateFoodInCategory,
//                 deleteFoodFromCategory,
//             }}
//         >
//             {children}
//         </CategoryContext.Provider>
//     );
// };
