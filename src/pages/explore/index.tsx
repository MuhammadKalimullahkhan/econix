import Loading from "@/components/loading";
import ProductCard from "@/components/products/product-card";
import { useSearchProduct } from "@/lib/react-query/queries";
import { useParams } from "react-router-dom";

const ExplorePage = () => {
  const { term } = useParams();
  const { data: productList, isLoading } = useSearchProduct(
    term?.toLowerCase()!
  );

  console.log(productList);

  return (
    <section>
      <div className="container">
        <p>You Search</p>
        <h2 className="text-2xl font-bold">{term}</h2>
      </div>
      {isLoading && <Loading />}
      <div className="mt-8 innerContainer">
        <div className="w-full gap-2 grid grid-cols-2">
          {productList &&
            productList.documents.map((product) => (
              <ProductCard
                key={product.$id}
                imagePath={product.images[0]}
                name={product.name}
                slug={product.$id}
                price={product.price}
                reviews={12}
                rating={4.5}
              />
            ))}
        </div>
      </div>
    </section>
  );
};

export default ExplorePage;
