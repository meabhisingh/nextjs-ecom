export type ProductType = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  categoryId: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CartItemType = {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
  quantity: number;
};

export type CartActionType = "increase" | "decrease";

export type QueryType = {
  search: string;
  category: string;
};
