import { Client, Account, Databases, Storage, Avatars } from "appwrite";

export const appwriteConfig = {
  url: import.meta.env.VITE_APPWRITE_URL,
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  storageId: import.meta.env.VITE_APPWRITE_BUCKET_ID,

  collections: {
    users: String(import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID),
    review: String(import.meta.env.VITE_APPWRITE_REVIEWS_COLLECTION_ID),
    products: String(import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID),
    sales: String(import.meta.env.VITE_APPWRITE_SALES_COLLECTION_ID),
    orders: String(import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID),
    shipment: String(import.meta.env.VITE_APPWRITE_SHIPMENT_COLLECTION_ID),
    payment_methods: String(
      import.meta.env.VITE_APPWRITE_PAYMENTS_METHODS_COLLECTION_ID
    ),
    categories: String(import.meta.env.VITE_APPWRITE_CATEGORIES_COLLECTION_ID),
  },
};

export const client = new Client();

client.setEndpoint(appwriteConfig.url);
client.setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
