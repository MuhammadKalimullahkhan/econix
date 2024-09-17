export enum USER_ROLES {
  ADMIN = "admin",
  SUPER_ADMIN = "superadmin",
  EDITOR = "editor",
  CUSTOMER = "customer",
}

export type INewUser = {
  name: string;
  email: string;
  password: string;
};

export type IUser = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  imageUrl: URL | string;
  role: USER_ROLES;
};

export type IUpdateUser = {
  id: string;
  name: string;
  role: USER_ROLES;
  imageId: string;
  imageUrl: URL | string;
  file: File[];
};

export type Product = {
  name: string;
  description: string;
  price: number;
  stock: number;
  images: URL[] | string[];
  categoryId: string;
  // categories: Category[]
};

export type Reviews = {
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  users: any;
  products: any;
};
