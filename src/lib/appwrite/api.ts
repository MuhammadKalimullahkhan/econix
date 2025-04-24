import { AppwriteException, ID, Query } from "appwrite";

import { INewUser, Reviews, USER_ROLES } from "@/types";
import { account, appwriteConfig, databases, storage } from "./config";

// ============================================================
// AUTH
// ============================================================

// ============================== SIGN UP
export async function createUserAccount(user: INewUser) {
  const newAccount = await account.create(
    ID.unique(),
    user.email,
    user.password,
    user.name
  );

  await account.createEmailPasswordSession(user.email, user.password);
  await account.createVerification(window.location.origin + "/confirm-email");

  if (!newAccount) throw AppwriteException;

  return newAccount;
}

// ============================== SAVE USER TO DB
export async function saveUserToDB(user: {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  verified: boolean;
  role?: USER_ROLES;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collections.users,
      ID.unique(),
      user
    );

    return newUser;
  } catch (error) {
    console.log(error);
  }
}

// ============================== SIGN IN
export async function signInAccount(user: { email: string; password: string }) {
  try {
    await signOutAccount();
    const session = await account.createEmailPasswordSession(
      user.email,
      user.password
    );

    return session;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

// ============================== GET ACCOUNT
export async function getAccount() {
  // try {
  const currentAccount = await account.get();

  return currentAccount;
  // } catch (error) {
  //   console.log(error);
  // }
}

// ============================== GET USER
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.collections.users,
      [Query.equal("id", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

// ============================== SIGN OUT
export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    console.log(error);
  }
}

// ============================================================
// CATEGORIES
// ============================================================
export async function getCategories() {
  try {
    const categories = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.collections.categories,
      [Query.orderAsc("name")]
    );
    if (!categories) throw Error;
    return categories;
  } catch (error) {
    console.log(error);
  }
}

export async function getPaymentMethods() {
  try {
    const paymentMethods = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.collections.payment_methods,
      [Query.orderAsc("name")]
    );
    if (!paymentMethods) throw Error;
    return paymentMethods;
  } catch (error) {
    console.log(error);
  }
}

// ============================================================
// REVIEWS
// ============================================================
export async function getReviewsByProductId(productId: string) {
  try {
    const dbReviews = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.collections.review,
      [Query.equal("productId", productId)]
    );

    if (!dbReviews) {
      throw Error;
    }

    return dbReviews;
  } catch (error) {
    console.log(error);
  }
}

export async function createReview(reviewObj: Reviews) {
  try {
    const newReview = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collections.review,
      ID.unique(),
      reviewObj
    );

    if (!newReview) {
      throw Error;
    }

    return newReview;
  } catch (error) {
    console.log(error);
  }
}

// ============================================================
// PRODUCTS
// ============================================================

export async function getInfiniteProducts({
  pageParam,
}: {
  pageParam: number;
}) {
  const size = 5;
  const queries: any[] = [Query.orderDesc("$createdAt"), Query.limit(size)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const products = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.collections.products,
      queries
    );

    if (!products) throw Error;
    return products;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET POST BY ID
export async function getProductById(productId?: string) {
  if (!productId) throw Error;

  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collections.products,
      productId
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}

// ============================== UPLOAD FILE
export async function uploadRecipt(
  file: File
): Promise<{ message: string; filePath: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(
    import.meta.env.VITE_ADMIN_APP_URL + "/api/upload/recipt",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error("Failed to upload file");
  }
  if (res.status === 500) {
    throw new Error("Server error");
  }

  return await res.json();
}

export async function uploadFile(file: File) {
  let uploadedFile;
  try {
    uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );
  } catch (error) {
    console.log(error);
  }
  return uploadedFile;
}

// ============================== GET FILE URL
export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      600,
      600
    );
    if (!fileUrl) throw Error;
    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}

// ============================== DELETE FILE
export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);
    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET POSTS
export async function searchProduct(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.collections.products,
      [Query.search("name", searchTerm)] // here name is the column name of 'product' table.
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

// PURCHASE
export async function createPurchase(purchaseObj: any) {
  try {
    // const uploadedFile = await uploadFile(purchaseObj.recieptImage);
    // if (!uploadedFile) throw Error;

    const imgPreviewUrl = await uploadRecipt(purchaseObj.recieptImage);
    if (!imgPreviewUrl) throw Error;

    const newPurchase = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collections.orders,
      ID.unique(),
      { ...purchaseObj, recieptImage: imgPreviewUrl.filePath }
    );

    if (!newPurchase) {
      throw Error;
    }

    return newPurchase;
  } catch (error: any) {
    console.error(error);
  }
}

// ORDERS
export async function getCurrentUserOrders() {
  try {
    const currentAccount = await getCurrentUser();
    if (!currentAccount) throw new Error("Please! login first");

    const newPurchase = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.collections.orders,
      [Query.equal("users", currentAccount.$id), Query.orderDesc("$createdAt")]
    );

    return newPurchase;
  } catch (error: any) {
    console.error(error);
  }
}

// SHIPMENT
export async function createShipment(data: any) {
  try {
    const newShipment = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collections.shipment,
      ID.unique(),
      data
    );
    if (!newShipment) throw AppwriteException;

    return newShipment;
  } catch (error: any) {
    console.error(error);
  }
}

export async function getOrderById(id: string) {
  try {
    const currentAccount = await getCurrentUser();
    if (!currentAccount) throw new Error("Please! login first");

    const order = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collections.orders,
      id,
      []
    );

    return order;
  } catch (error: any) {
    console.error(error);
  }
}
