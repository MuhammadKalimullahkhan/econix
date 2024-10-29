import { Star } from "react-feather";
import { useNavigate } from "react-router-dom";

interface IProductCardProps {
  name: string;
  price: number;
  stock: number;
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
  stock,
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
        className="w-full h-[190px] object-top object-cover"
        src={imagePath as string}
        alt=""
      />

      <span className="p-2 rounded-lg absolute right-4 top-[155px] bg-white/40 backdrop-blur-lg font-semibold border border-white">
        {stock} Items in stock
      </span>

      <div className="p-3">
        <div className="font-bold">
          <span>{name}</span>
        </div>
        <div className="mt-4 text-sm flex justify-between">
          <div className="gap-1 flex items-center">
            <Star className="w-3 h-3 text-secondary" />
            <p className="divide-x divide-solid">
              <span className="pr-2">{rating ? rating : "No Rating"}</span>
              <span className="px-2">{reviews}</span>
            </p>
          </div>
          <p className="mt-1 font-bold bg-green">RS {price}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
