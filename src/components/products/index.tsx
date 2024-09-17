import { InfiniteData } from "@tanstack/react-query";
import { Models } from "appwrite";
import CardsSkeleton from "../shared/skeleton/cards";
import ProductCard from "./product-card";

const Products = ({
  productList,
  isLoading,
}: {
  productList: InfiniteData<
    Models.DocumentList<Models.Document> | undefined,
    unknown
  >;
  isLoading: boolean;
}) => {
  console.log(productList);

  return (
    <>
      <div className="w-full gap-2 grid grid-cols-2">
        {isLoading ? (
          <CardsSkeleton />
        ) : (
          productList &&
          productList.pages.map((page) =>
            page?.documents.map((product) => (
              <ProductCard
                key={product.$id}
                imagePath={product.images[0]}
                name={product.name}
                slug={product.$id}
                price={product.price}
                reviews={product.reviews.length}
                rating={
                  product.reviews.reduce(
                    (acc: any, review: any) => acc + review.rating,
                    0
                  ) / product.reviews.length
                }
              />
            ))
          )
        )}
      </div>
    </>
  );
};

export default Products;
