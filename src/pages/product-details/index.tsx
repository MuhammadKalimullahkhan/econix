import { useParams } from "react-router-dom";
import { useGetProductById } from "@/lib/react-query/queries";

import Loading from "@/components/loading";
import ProductOverview from "./product-overview";
import ProductSpecification from "./product-specification";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProductDetailsPage = () => {
  const { productId } = useParams();

  const { data: product, isLoading } = useGetProductById(productId);

  return (
    <section className="container">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div>
            <span className="text-primary font-bold">USD {product?.price}</span>
            <span className="p-2 bg-muted float-end rounded-lg">
              Stock <strong>{product?.stock}</strong>
            </span>
            <h2 className="text-2xl font-bold">{product?.name}</h2>
            <div className="text-zinc-400">
              {product?.categories.map((category: any, i: any) => (
                <span key={i}>#{category.name} </span>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="specification">Specification</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <ProductOverview productDetails={product} />
              </TabsContent>
              <TabsContent value="specification">
                <ProductSpecification productDetails={product} />
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </section>
  );
};

export default ProductDetailsPage;
