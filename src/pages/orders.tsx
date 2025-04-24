import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { useGetCurrentUserOrders } from "@/lib/react-query/queries";
import { displayImage, multiFormatDateString } from "@/lib/utils";
import { NavLink, useNavigate } from "react-router-dom";

const OrdersPage = () => {
  const { data: currentUserOrders, isLoading: isLoadingCurrentOrders } =
    useGetCurrentUserOrders();

  const navigate = useNavigate();

  return (
    <section className="container">
      {isLoadingCurrentOrders ? (
        <Loading />
      ) : (
        <div className="space-y-4">
          {currentUserOrders?.documents.map((order, index) => (
            <div
              key={index}
              className="flex items-start gap-4 border-b py-4 last:border-b-0"
            >
              <NavLink to={`/product/${order.products.$id}`}>
                <div className="relative aspect-[5/3.4] w-28 flex-shrink-0 border rounded-md">
                  <img
                    loading="lazy"
                    decoding="async"
                    data-nimg="fill"
                    className="bg-muted-foreground object-cover rounded-md"
                    sizes="100vw"
                    src={displayImage(order.products.images[0])}
                    alt="product image"
                  />
                </div>
              </NavLink>
              <div className="flex flex-1 flex-col gap-4">
                <div className="border-b border-light-400 pb-3">
                  <p className="text-muted-foreground text-sm">
                    Ordered {multiFormatDateString(order.$createdAt)}
                  </p>
                  <NavLink
                    to={`/product/${order.products.$id}`}
                    rel="noreferrer"
                    className="font-medium text-primary"
                  >
                    <h3
                      className="my-1.5 font-medium text-card-foreground"
                      title="click to view the product"
                    >
                      {order.products.name}
                    </h3>
                  </NavLink>
                  <p className="text-sm text-muted-foreground">
                    RS {order.products.price} {` x ${order.quantity}`} via{" "}
                    <span className="font-bold uppercase">
                      {order.paymentMethods.name}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    size={"sm"}
                    className="flex-1"
                    title="track product shipment"
                    onClick={() => navigate("/orders/" + order.$id)}
                  >
                    Track
                  </Button>
                  {/* <Button
                    size={"sm"}
                    variant={"destructive"}
                    className="flex-1"
                    title="cancel order"
                  >
                    Cancel
                  </Button> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default OrdersPage;
