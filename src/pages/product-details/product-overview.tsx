import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

import StarRating from "@/components/star-rating";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordin";
import { Button, buttonVariants } from "@/components/ui/button";
import { RootState } from "@/redux/store";
import { Models } from "appwrite";
import { useState } from "react";
import { useSelector } from "react-redux";
import ReviewCards from "./review-cards";
import { useCreateReview } from "@/lib/react-query/queries";
import Loading from "@/components/loading";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import WhatsApp from "@/components/icons/whatsapp";

const ProductOverview = ({
  productDetails,
}: {
  productDetails: Models.Document | undefined;
}) => {
  const WHATS_APP_CONTACT = `${import.meta.env.VITE_WHATS_APP_API}?phone=${
    import.meta.env.VITE_WHATS_APP_CONTACT
  }&text=${import.meta.env.VITE_WHATS_APP_MESSAGE}`;

  const userData = useSelector((state: RootState) => state.auth.user);

  const [showReviewSection, setShowReviewSection] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState<number | null>(null);

  // Query
  const { mutateAsync: createReview, isPending: isLoadingCreateReview } =
    useCreateReview();

  async function handleSubmitReview() {
    const newReview = await createReview({
      userId: userData?.$id!,
      productId: productDetails?.$id!,
      comment: reviewText,
      rating: rating!,
      users: userData?.$id,
      products: productDetails?.$id,
    });

    if (!newReview) {
      toast({
        title: `Failed to add review. Please try again.`,
      });
      throw Error;
    }

    toast({
      title: "Review added",
      description: "Thank you for your feedback.",
    });

    // reset the form
    setRating(null);
    setReviewText("");
  }
  return (
    <section>
      <Swiper
        spaceBetween={20}
        slidesPerView={1.15}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => console.log(swiper)}
      >
        {productDetails &&
          productDetails.images.map((image: string) => (
            <SwiperSlide key={image}>
              <img src={image} alt="" className="object-fill" />
              {/* <div className="rounded-xl h-[200px] bg-accent flex justify-center">
              </div> */}
            </SwiperSlide>
          ))}
      </Swiper>
      {showReviewSection ? (
        <div className="mt-10 space-y-4">
          <div>
            <label htmlFor="review">Review text</label>
            <textarea
              name="review"
              id="review"
              placeholder="the product is very cool..."
              className="p-3 border w-full rounded-lg"
              onChange={(e) => setReviewText(e.target.value)}
              rows={20}
            ></textarea>
          </div>
          <div>
            <StarRating rating={rating} onRatingChange={setRating} />
            {/* <Label>Stars</Label>
            <Input type="number" placeholder="5" minLength={1} maxLength={5} /> */}
          </div>
          <Button onClick={handleSubmitReview} disabled={isLoadingCreateReview}>
            {isLoadingCreateReview ? <Loading /> : "Add Review"}
          </Button>
          <Button
            className="ml-2"
            variant={"outline"}
            onClick={() => setShowReviewSection((prev) => !prev)}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <div className="flex gap-3 mt-4 ">
          <Button
            variant={"outline"}
            className="w-full"
            onClick={() => setShowReviewSection((prev) => !prev)}
          >
            Add Review
          </Button>
          <Link
            to={WHATS_APP_CONTACT}
            className={buttonVariants({
              variant: "default",
              className: "w-full",
            })}
          >
            <WhatsApp />
            WhatsApp chat
          </Link>
        </div>
      )}

      <div className="mt-8 bg-accent px-3 rounded-xl">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1" className="border-b-0">
            <AccordionTrigger>
              Reviews {`(${productDetails?.reviews.length})`}
            </AccordionTrigger>
            <AccordionContent>
              <ReviewCards productId={productDetails && productDetails.$id} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};

export default ProductOverview;
