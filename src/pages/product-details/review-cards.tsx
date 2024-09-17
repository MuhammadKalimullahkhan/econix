import ReviewCard from "@/components/review-card";
import { useGetReviews } from "@/lib/react-query/queries";
import { multiFormatDateString } from "@/lib/utils";

const ReviewCards = ({ productId }: { productId?: string }) => {
  const { data: reviews, isLoading } = useGetReviews(productId!);

  return (
    <>
      {!isLoading &&
        reviews?.documents.map(
          (review, i) =>
            review.users && (
              <ReviewCard
                key={i}
                userProfileImage={review.users.imageUrl}
                userName={review.users.name}
                comment={review.comment}
                rating={review.rating}
                postTime={multiFormatDateString(review.$createdAt)}
              />
            )
        )}
    </>
  );
};

export default ReviewCards;
