import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { IconInput } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { createShipment } from "@/lib/appwrite/api";
import {
  useCreatePurchase,
  useGetPaymentMethods,
  useGetProductById,
} from "@/lib/react-query/queries";
import { displayImage } from "@/lib/utils";
import { RootState } from "@/redux/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppwriteException, ID } from "appwrite";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { z } from "zod";

const PlaceOrderPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const { data: productData, isLoading: isLoadingProduct } =
    useGetProductById(productId);

  const { data: paymentMethodsData, isLoading: isLoadingPaymentMethods } =
    useGetPaymentMethods();

  const { mutateAsync: createPurchase, isPending: isCreatingPurchase } =
    useCreatePurchase();

  const userData = useSelector((state: RootState) => state.auth.user);

  const schema = z.object({
    quantity: z
      .number()
      .min(1, "Quantity must be at least 1")
      .positive("Quantity must be positive"),
    address: z
      .string()
      .min(15, "Address must be at least 15 characters")
      .max(1024, "Address must be less than 1024 characters"),
    paymentMethod: z.string(),
    recieptImage: z
      .instanceof(File)
      .refine((file) => file && file.size > 0, {
        message: "Image file is required",
      })
      .refine((file) => file && file.size <= 5 * 1024 * 1024, {
        // 5MB limit
        message: "Image file must be less than 5MB",
      }),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { quantity: 1, address: "" },
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    if (!productData) return;

    if (!values.paymentMethod)
      return toast({
        title: "Purchased Failed",
        description: "Payment Method is required",
        variant: "destructive",
      });

    if (parseInt(productData.stock) < values.quantity)
      return toast({
        title: "Could'nt Ordered",
        description:
          "Stock limit exceded. Stock limit is: " + productData.stock,
        variant: "destructive",
      });

    try {
      const newOrder = await createPurchase({
        quantity: values.quantity,
        recieptImage: values.recieptImage,
        amountPaid: productData?.price * values.quantity,
        users: userData?.$id,
        products: productData?.$id,
        paymentMethods: values.paymentMethod,
      });

      if (!newOrder) throw AppwriteException;

      const newShipment = await createShipment({
        trackingNumber: ID.unique().toString().slice(0, 9),
        address: values.address,
        orders: newOrder.$id,
      });

      if (!newShipment) throw AppwriteException;

      toast({
        title: "Order Success",
        description: "Your Order has been placed.",
      });

      // redirect to orders page
      navigate("/orders");
    } catch (error: any) {
      toast({
        title: "Order Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      form.reset();
    }
  }

  return (
    <section className="container">
      <Swiper
        spaceBetween={20}
        slidesPerView={1.15}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => console.log(swiper)}
      >
        {isLoadingProduct ? (
          <Loading />
        ) : (
          productData?.images.map((image: string) => (
            <SwiperSlide key={image} className="border rounded-md">
              <img src={displayImage(image)} alt="" className="object-fill" />
              {/* <div className="rounded-xl h-[200px] bg-accent flex justify-center">
              </div> */}
            </SwiperSlide>
          ))
        )}
      </Swiper>

      <div className="mt-4">
        <h1 className="text-xl font-medium">{productData?.name}</h1>
        <p>RS {productData?.price}</p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <IconInput
                      {...field}
                      type="number"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      placeholder="Product Quantity"
                      error={form.formState.errors.quantity}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel title="the destination address product will shipped to.">
                    Address
                  </FormLabel>
                  <FormControl>
                    <IconInput
                      {...field}
                      type="text"
                      placeholder="Shipment Address"
                      error={form.formState.errors.address}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {isLoadingPaymentMethods ? (
              <Loading />
            ) : (
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Payment Method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {paymentMethodsData &&
                          paymentMethodsData.documents.map((paymentMethod) => (
                            <SelectItem
                              key={paymentMethod.$id}
                              value={paymentMethod.$id}
                              className="capitalize"
                            >
                              {paymentMethod.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="recieptImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Reciept</FormLabel>
                  <FormControl>
                    <IconInput
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                      type="file"
                      error={form.formState.errors.recieptImage}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isCreatingPurchase}
            >
              {isCreatingPurchase ? <Loading /> : "Proceed"}
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
};

export default PlaceOrderPage;
