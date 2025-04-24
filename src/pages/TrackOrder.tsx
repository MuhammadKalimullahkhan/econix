import Loading from "@/components/loading";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetOrderById } from "@/lib/react-query/queries";
import { displayImage, formatDateString } from "@/lib/utils";
import { PropsWithChildren } from "react";
import { Check } from "react-feather";
import { useParams } from "react-router-dom";

const OrderTracker: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="grid grid-cols-[24px_1fr] gap-2">
      <Check className="p-1 bg-primary/20 text-primary box-border rounded-full" />
      <div className="flex flex-col items-start">
        <span className="text-muted-foreground">{children}</span>
      </div>
    </div>
  );
};
const TrackOrder = () => {
  const { orderId } = useParams();

  const { data: currentOrder, isLoading: isLoadingOrder } =
    useGetOrderById(orderId);

  return isLoadingOrder ? (
    <Loading />
  ) : (
    <section className="container">
      <div className="py-6">
        <div className="text-heading mb-0 flex flex-col flex-wrap items-center gap-x-8 text-base font-bold">
          <div className="order-2 flex w-full max-w-full basis-full gap-6 justify-between">
            <div className="flex flex-wrap items-center">
              <span className="mb-2 block">Order Status</span>
              <div className="w-full">
                <Badge variant={"outline"} className="font-normal capitalize">
                  {currentOrder?.shipment.status}
                </Badge>
              </div>
            </div>
            <div className="flex flex-wrap items-center">
              <span className="mb-2 block">Payment Status</span>
              <div className="w-full">
                {currentOrder?.paymentStatus ? (
                  <Badge className="font-normal">Completed</Badge>
                ) : (
                  <Badge variant={"outline"} className="font-normal">
                    Pending
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pb-12 pt-9">
        <div className="mb-6 grid gap-4">
          <Card>
            <CardHeader>
              <CardDescription>Order Number</CardDescription>
              <CardTitle>{currentOrder?.$id}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Date</CardDescription>
              <CardTitle>
                {formatDateString(currentOrder?.$createdAt!)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Total</CardDescription>
              <CardTitle>{currentOrder?.amountPaid}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Payment Method</CardDescription>
              <CardTitle>{currentOrder?.paymentMethods.name}</CardTitle>
            </CardHeader>
          </Card>
        </div>
        <div className="mt-12 flex flex-col">
          <div className="w-full">
            <h2 className="mb-4 font-medium">Order Status</h2>
            <div className="w-full flex flex-col gap-3 items-start">
              <OrderTracker>
                Order is{" "}
                <span className="capitalize">
                  {currentOrder?.shipment.status}
                </span>
              </OrderTracker>
            </div>
          </div>
          <div className="my-10 w-full">
            <h2 className="mb-6 font-medium dark:text-white">Order Details</h2>
            <table className="w-full">
              <thead>
                <th></th>
                <th></th>
              </thead>
              <tbody>
                <tr>
                  <td className="font-medium text-start">Total Item</td>
                  <td>{currentOrder?.quantity} Item(s)</td>
                </tr>
                <tr>
                  <td className="font-medium text-start">Sub Total</td>
                  <td>RS {currentOrder?.products.price}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th className="pt-3 text-start">Total</th>
                  <th className="pt-3 text-start">
                    RS {currentOrder?.amountPaid}
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        <div className="mt-12">
          <Card className="p-0">
            <CardContent className="p-0 overflow-x-auto overflow-y-hidden">
              <table className="table-custom">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Shipment Address</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="gap-3 grid grid-cols-[64px_1fr]">
                        <img
                          alt=""
                          className="w-16 rounded-md"
                          src={displayImage(currentOrder?.products.images[0])}
                        />
                        <div>
                          <div className="font-medium">
                            {currentOrder?.products.name}
                          </div>
                          <strong>RS {currentOrder?.products.price}</strong>
                        </div>
                      </div>
                    </td>
                    <td>{currentOrder?.quantity}</td>
                    <td>{currentOrder?.shipment.address}</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TrackOrder;
