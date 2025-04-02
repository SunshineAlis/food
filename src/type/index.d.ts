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
    _id?: string;
    categoryName: string;
    foodCount?: number;
    foods?: Food[]
    _id: string;
    categoryName: string;
};
type CategoryId = {
    _id: string;
    name: string;

}

