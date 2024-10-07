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
  return (
    <>
      <div className="w-full gap-4 grid grid-cols-1">
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
                price={product.price.toFixed(2)}
                stock={product.stock}
                reviews={product.reviews.length}
                rating={parseFloat(
                  (
                    product.reviews.reduce(
                      (acc: any, review: any) => acc + review.rating,
                      0
                    ) / product.reviews.length
                  ).toFixed(2)
                )}
              />
            ))
          )
        )}
      </div>
    </>
  );
};

export default Products;
