import { cn } from "@/lib/utils";
import React from "react";
import { Star } from "react-feather";

const StarRating: React.FC<{
  rating: number | null;
  onRatingChange: any;
}> = ({ rating, onRatingChange }) => {
  const handleClick = (value: number) => {
    onRatingChange(value); // Set the current rating
  };

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={20} // Increased size for better visibility
          className={cn(
            "cursor-pointer text-secondary",
            rating && rating >= star
              ? "fill-current text-yellow-500"
              : "stroke-current text-gray-400"
          )}
          onClick={() => handleClick(star)}
        />
      ))}
    </div>
  );
};

export default StarRating;
