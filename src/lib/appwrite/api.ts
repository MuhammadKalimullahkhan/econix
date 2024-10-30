import { AppwriteException, ID, Query } from "appwrite";

import { INewUser, Reviews, USER_ROLES } from "@/types";
import { account, appwriteConfig, databases, storage } from "./config";

// ============================================================
// AUTH
// ============================================================

// ============================== SIGN UP
export async function createUserAccount(user: INewUser) {
  try {
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
  } catch (error) {
    console.log(error);
    return error;
  }
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
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    console.log(error);
  }
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

// ============================== CREATE POST
// export async function createProduct(product: INewProduct) {
//   try {
//     // Upload file to appwrite storage
//     const uploadedFile = await uploadFile(product.file[0]);

//     if (!uploadedFile) throw Error;

//     // Get file url
//     const fileUrl = getFilePreview(uploadedFile.$id);
//     if (!fileUrl) {
//       await deleteFile(uploadedFile.$id);
//       throw Error;
//     }

//     // Convert tags into array
//     const tags =
//       product.categories?.forEach((category) =>
//         category?.replace(/ /g, "").split(",")
//       ) || [];

//     // Create post
//     const newProduct = await databases.createDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.collections.products,
//       ID.unique(),
//       {
//         creator: product.userId,
//         title: product.title,
//         imageUrl: [fileUrl],
//         // imageId: uploadedFile.$id,
//         location: product.location,
//         tags: tags,
//       }
//     );

//     if (!newProduct) {
//       await deleteFile(uploadedFile.$id);
//       throw Error;
//     }

//     return newProduct;
//   } catch (error) {
//     console.log(error);
//   }
// }

// ============================== UPLOAD FILE
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
    const uploadedFile = await uploadFile(purchaseObj.recieptImage);
    if (!uploadedFile) throw Error;

    const imgPreviewUrl = getFilePreview(uploadedFile.$id);

    const newPurchase = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.collections.purchases,
      ID.unique(),
      { ...purchaseObj, recieptImage: imgPreviewUrl }
    );

    if (!newPurchase) {
      throw Error;
    }

    return newPurchase;
  } catch (error: any) {
    console.error(error);
  }
}

// ============================== UPDATE POST
// export async function updatePost(post: IUpdatePost) {
//   const hasFileToUpdate = post.file.length > 0;

//   try {
//     let image = {
//       imageUrl: post.imageUrl,
//       imageId: post.imageId,
//     };

//     if (hasFileToUpdate) {
//       // Upload new file to appwrite storage
//       const uploadedFile = await uploadFile(post.file[0]);
//       if (!uploadedFile) throw Error;

//       // Get new file url
//       const fileUrl = getFilePreview(uploadedFile.$id);
//       if (!fileUrl) {
//         await deleteFile(uploadedFile.$id);
//         throw Error;
//       }

//       image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
//     }

//     // Convert tags into array
//     const tags = post.tags?.replace(/ /g, "").split(",") || [];

//     //  Update post
//     const updatedPost = await databases.updateDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.collections.products,
//       post.postId,
//       {
//         caption: post.caption,
//         imageUrl: image.imageUrl,
//         imageId: image.imageId,
//         location: post.location,
//         tags: tags,
//       }
//     );

//     // Failed to update
//     if (!updatedPost) {
//       // Delete new file that has been recently uploaded
//       if (hasFileToUpdate) {
//         await deleteFile(image.imageId);
//       }

//       // If no new file uploaded, just throw error
//       throw Error;
//     }

//     // Safely delete old file after successful update
//     if (hasFileToUpdate) {
//       await deleteFile(post.imageId);
//     }

//     return updatedPost;
//   } catch (error) {
//     console.log(error);
//   }
// }

// ============================== DELETE POST
// export async function deletePost(postId?: string, imageId?: string) {
//   if (!postId || !imageId) return;

//   try {
//     const statusCode = await databases.deleteDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.collections.products,
//       postId
//     );

//     if (!statusCode) throw Error;

//     await deleteFile(imageId);

//     return { status: "Ok" };
//   } catch (error) {
//     console.log(error);
//   }
// }

// ============================== LIKE / UNLIKE POST
// export async function likePost(postId: string, likesArray: string[]) {
//   try {
//     const updatedPost = await databases.updateDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.collections.products,
//       postId,
//       {
//         likes: likesArray,
//       }
//     );

//     if (!updatedPost) throw Error;

//     return updatedPost;
//   } catch (error) {
//     console.log(error);
//   }
// }

// ============================== SAVE POST
// export async function savePost(userId: string, postId: string) {
//   try {
//     const updatedPost = await databases.createDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.savesCollectionId,
//       ID.unique(),
//       {
//         user: userId,
//         post: postId,
//       }
//     );

//     if (!updatedPost) throw Error;

//     return updatedPost;
//   } catch (error) {
//     console.log(error);
//   }
// }
// ============================== DELETE SAVED POST
// export async function deleteSavedPost(savedRecordId: string) {
//   try {
//     const statusCode = await databases.deleteDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.savesCollectionId,
//       savedRecordId
//     );

//     if (!statusCode) throw Error;

//     return { status: "Ok" };
//   } catch (error) {
//     console.log(error);
//   }
// }

// ============================== GET USER'S POST
// export async function getUserPosts(userId?: string) {
//   if (!userId) return;

//   try {
//     const post = await databases.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.collections.products,
//       [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
//     );

//     if (!post) throw Error;

//     return post;
//   } catch (error) {
//     console.log(error);
//   }
// }

// ============================================================
// USER
// ============================================================

// ============================== GET USERS
// export async function getUsers(limit?: number) {
//   const queries: any[] = [Query.orderDesc("$createdAt")];

//   if (limit) {
//     queries.push(Query.limit(limit));
//   }

//   try {
//     const users = await databases.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.collections.users,
//       queries
//     );

//     if (!users) throw Error;

//     return users;
//   } catch (error) {
//     console.log(error);
//   }
// }

// ============================== GET USER BY ID
// export async function getUserById(userId: string) {
//   try {
//     const user = await databases.getDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.collections.users,
//       userId
//     );

//     if (!user) throw Error;

//     return user;
//   } catch (error) {
//     console.log(error);
//   }
// }

// ============================== UPDATE USER
// export async function updateUser(user: IUpdateUser) {
//   const hasFileToUpdate = user.file.length > 0;
//   try {
//     let image = {
//       imageUrl: user.imageUrl,
//       imageId: user.imageId,
//     };

//     if (hasFileToUpdate) {
//       // Upload new file to appwrite storage
//       const uploadedFile = await uploadFile(user.file[0]);
//       if (!uploadedFile) throw Error;

//       // Get new file url
//       const fileUrl = getFilePreview(uploadedFile.$id);
//       if (!fileUrl) {
//         await deleteFile(uploadedFile.$id);
//         throw Error;
//       }

//       image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
//     }

//     //  Update user
//     const updatedUser = await databases.updateDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.collections.users,
//       user.userId,
//       {
//         name: user.name,
//         bio: user.bio,
//         imageUrl: image.imageUrl,
//         imageId: image.imageId,
//       }
//     );

//     // Failed to update
//     if (!updatedUser) {
//       // Delete new file that has been recently uploaded
//       if (hasFileToUpdate) {
//         await deleteFile(image.imageId);
//       }
//       // If no new file uploaded, just throw error
//       throw Error;
//     }

//     // Safely delete old file after successful update
//     if (user.imageId && hasFileToUpdate) {
//       await deleteFile(user.imageId);
//     }

//     return updatedUser;
//   } catch (error) {
//     console.log(error);
//   }
// }
