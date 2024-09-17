import { Star } from "react-feather";
import { useNavigate } from "react-router-dom";

interface IProductCardProps {
  name: string;
  price: number;
  imagePath: string | URL;
  slug: string;

  rating: number;
  reviews: number;
}
const ProductCard = ({
  name,
  rating,
  reviews,
  price,
  slug,
  imagePath,
}: IProductCardProps) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/product/" + slug);
  };
  return (
    <div
      className="overflow-hidden bg-card rounded-xl drop-shadow-sm hover:drop-shadow-2xl"
      onClick={handleClick}
    >
      <img
        className="w-full h-[120px] md:h-64 object-top object-cover"
        src={imagePath as string}
        alt=""
      />

      <div className="p-3">
        <div className="mt-4">
          <span>{name}</span>
          <p className="mt-1 font-bold bg-green">USD {price}</p>
        </div>
        <div className="mt-2 text-sm flex justify-between">
          <div className="gap-1 flex items-center">
            <Star className="w-3 h-3 text-secondary" />
            <p>{rating}</p>
          </div>
          <p>{reviews} Reviews</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
