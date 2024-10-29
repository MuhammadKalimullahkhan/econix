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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  useCreatePurchase,
  useGetPaymentMethods,
  useGetProductById,
} from "@/lib/react-query/queries";
import { RootState } from "@/redux/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { z } from "zod";

const OrderPage = () => {
  const { productId } = useParams();

  const { data: productData, isLoading: isLoadingProduct } =
    useGetProductById(productId);

  const { data: paymentMethodsData, isLoading: isLoadingPaymentMethods } =
    useGetPaymentMethods();

  const { mutateAsync: createPurchase, isPending: isCreatingPurchase } =
    useCreatePurchase();

  const userData = useSelector((state: RootState) => state.auth.user);

  const schema = z.object({
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
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      await createPurchase({
        recieptImage: values.recieptImage,
        amountPaid: productData?.price,
        users: userData?.$id,
        products: productData?.$id,
        paymentMethods: values.paymentMethod,
      });

      toast({
        title: "Purchased Success",
        description: "You Purchased this item",
      });
    } catch (error: any) {
      toast({
        title: "Purchased Failed",
        description: error.message,
      });
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
              <img
                src={JSON.parse(image).href}
                alt=""
                className="object-fill"
              />
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
                    <Input
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                      type="file"
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

export default OrderPage;
