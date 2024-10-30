import Loading from "@/components/loading";
import ProductCard from "@/components/products/product-card";
import { useSearchProduct } from "@/lib/react-query/queries";
import { useParams } from "react-router-dom";

const ExplorePage = () => {
  const { term } = useParams();
  const { data: productList, isLoading } = useSearchProduct(
    term?.toLowerCase()!
  );

  return (
    <section>
      <div className="container">
        <p>You Search For</p>
        <h2 className="text-2xl font-bold">{term}</h2>
      </div>
      {isLoading && <Loading />}
      <div className="mt-8">
        <div className="w-full gap-4 grid grid-cols-1 p-3">
          {productList?.documents.length! > 0 ? (
            productList?.documents.map((product) => (
              <ProductCard
                key={product.$id}
                imagePath={String(JSON.parse(product.images[0]).href).replace(
                  /width=2000&height=2000/g,
                  "width=300&height=300"
                )}
                name={product.name}
                slug={product.$id}
                price={product.price}
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
          ) : (
            <div className="text-center"> - No Result Found -</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ExplorePage;
