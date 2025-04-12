type Food = {
    _id: string;
    foodName: string;
    price: number;
    ingredients: string;
    image?: string | null | File;
    categoryId?: string;
    imageUrl?: string;
};
type EditFoodProps = {
    editingFood: Food;
    setEditingFood: React.Dispatch<React.SetStateAction<Food | null>>;
};
type AddFoodProps = {
    setShowAddFoodModal: (value: boolean) => void;
};
type CategoryContextType = {
    categories: Category[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
    addCategory: (newCategory: Category) => void;
    updateCategory: (updatedCategory: Category) => void;
    deleteCategory: (categoryId: string) => void;
    addFoodToCategory: (newFood: Food) => void;
    updateFoodInCategory: (updatedFood: Food) => void;
    deleteFoodFromCategory: (foodId: string, categoryId: string) => void;
};
type OrderContextType = {
    userOrders: UserOrder[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
    handleDeleteOrder: (orderId: string) => void;
    handleStatusChange: (orderId: string, newStatus: string) => void;
};
type FoodItemProps = {
    food: Food;
    onEdit: () => void;
};
type CategoryId = {
    _id: string;
    name: string;

}
type FoodItem = {
    foodName: string;
    image: string;
    quantity: number;
    total: number;
    unitPrice: number;
    categoryName?: string;
}
type Order = {
    _id: string;
    email: string;
    phone: string;
    address: string;
    foodList: FoodItem[];
    orderTotal: number;
    orderStatus: string;
    createdAt: string;
}

type UserOrder = {
    email: string;
    orders: Order[];
    totalSpent: number;
}

type HoveredOrderProps = {
    order: Order;
};
type Food = {
    _id: string;
    foodName: string;
    price: number;
    ingredients: string;
    image?: string | null | File;
    categoryId?: string;
    imageUrl?: string;
};
type Category = {
    foodCount: number;
    _id: string;
    categoryName: string;
    foods?: Food[];
    _id: string;
    categoryName: string;
    foods?: Food[];
};
// type Category = {
//     _id?: string;
//     categoryName: string;
//     foodCount?: number;
//     foods?: Food[]
//     _id: string;
//     categoryName: string;
// };

type ImageUploaderProps = {
    imagePreview: string | null;
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};