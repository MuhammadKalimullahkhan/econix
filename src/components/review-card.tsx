import { Star } from "react-feather";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Rating = ({ value }: { value: number }) => {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) =>
        value <= i ? (
          <Star key={i} size={12} className="text-zinc-300" />
        ) : (
          <Star
            key={i}
            fill="true"
            size={12}
            className="text-secondary fill-secondary"
          />
        )
      )}
    </div>
  );
};
const ReviewCard = ({
  userProfileImage,
  userName,
  comment,
  postTime,
  rating,
}: {
  userProfileImage: string;
  userName: string;
  comment: string;
  postTime: string;
  rating: number;
}) => {
  return (
    <>
      <div className="mt-4 pb-4 bg-background p-2 rounded-lg grid grid-cols-12 border-b">
        <div className="col-span-2">
          <Avatar>
            <AvatarImage src={userProfileImage} alt="@profileImage" />
            <AvatarFallback>EN</AvatarFallback>
          </Avatar>
        </div>
        <div className="col-span-10">
          <div className="flex flex-col">
            <p>{userName}</p>
            <div className="mb-2 text-xs text-zinc-400">{postTime}</div>
            <Rating value={rating} />
          </div>
          <p className="mt-4">{comment}</p>
        </div>
      </div>
    </>
  );
};

export default ReviewCard;
