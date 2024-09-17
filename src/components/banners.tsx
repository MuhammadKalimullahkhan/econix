import { Link } from "react-router-dom";

export interface IBannerProps {
  title: string;
  imagePath: string;
  slug: string;
}
const Banner = ({ title, imagePath, slug }: IBannerProps) => {
  return (
    <div className="min-w-[280px] rounded-xl bg-green-50/55 p-6 flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        <Link to={slug} className="block mt-4 text-primary">
          Shop now &rarr;
        </Link>
      </div>
      <div className="w-[300px]">
        <img src={imagePath} alt="" className="w-full" />
      </div>
    </div>
  );
};

export default Banner;
