import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetCurrentUserOrders } from "@/lib/react-query/queries";
import { cn, multiFormatDateString } from "@/lib/utils";

const OrdersPage = () => {
  const { data: currentUserOrders, isLoading: isLoadingCurrentOrders } =
    useGetCurrentUserOrders();
  return (
    <section className="container">
      {isLoadingCurrentOrders ? (
        <Loading />
      ) : (
        <div className="space-y-4">
          {currentUserOrders?.documents.map((order, index) => (
            <Card key={index} className="group relative p-2 rounded-md border">
              <CardHeader className="sm:flex justify-between">
                <CardTitle>Order ID: {order.$id}</CardTitle>
                <CardDescription>
                  Ordered {multiFormatDateString(order.$createdAt)}
                </CardDescription>
                <small
                  className={cn(
                    "transition opacity-0 group-hover:opacity-100 absolute right-2 top-2 p-1 px-2 rounded-full",
                    order.paymentStatus && "bg-primary text-primary-foreground",
                    !order.paymentStatus &&
                      "bg-destructive text-destructive-foreground"
                  )}
                >
                  {order.paymentStatus ? "Verified" : "Not-Verified"}
                </small>
              </CardHeader>
              <CardContent className="gap-3 grid grid-cols-[50px_1fr]">
                <img
                  src={JSON.parse(order.products.images[0]).href.replace(
                    /width=2000&height=2000/g,
                    "width=50&height=50"
                  )}
                  alt="product image"
                  className="rounded-md border"
                />
                <div>
                  <strong>{order.products.name}</strong>
                  <p className="text-sm text-muted-foreground">
                    RS {order.products.price} via{" "}
                    <span className="font-bold uppercase">
                      {order.paymentMethods.name}
                    </span>
                  </p>
                </div>
              </CardContent>
              <CardFooter className="space-x-3">
                <Button
                  size={"sm"}
                  variant={"outline"}
                  className="w-full md:w-auto"
                >
                  Track
                </Button>
                {/* <Button
                  size={"sm"}
                  variant={"destructive"}
                  className="w-full md:w-auto"
                >
                  Cancel
                </Button> */}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};

export default OrdersPage;
