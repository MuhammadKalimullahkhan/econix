import WhatsApp from "@/components/icons/whatsapp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useParams } from "react-router-dom";
import ProductOverview from "./product-overview";
import ProductSpecification from "./product-specification";

import { buttonVariants } from "@/components/ui/button";
import { useGetProductById } from "@/lib/react-query/queries";
import Loading from "@/components/loading";

const ProductDetailsPage = () => {
  const { productId } = useParams();

  const { data: product, isLoading } = useGetProductById(productId);

  const WHATS_APP_CONTACT = `${import.meta.env.VITE_WHATS_APP_API}?phone=${
    import.meta.env.VITE_WHATS_APP_CONTACT
  }&text=${import.meta.env.VITE_WHATS_APP_MESSAGE}
  ${window.location.href}
  `;

  return (
    <section className="container">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div>
            <p className="text-primary font-bold">USD {product?.price}</p>
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

          <Link
            to={WHATS_APP_CONTACT}
            className={buttonVariants({
              variant: "default",
              className: "mt-3 sticky bottom-3 w-full z-50",
            })}
          >
            <WhatsApp />
            WhatsApp chat
          </Link>
        </>
      )}
    </section>
  );
};

export default ProductDetailsPage;
