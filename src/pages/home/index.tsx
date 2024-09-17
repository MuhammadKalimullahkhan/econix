import Products from "@/components/products";
import { IconInput } from "@/components/ui/input";
import { useGetProducts } from "@/lib/react-query/queries";
import { RootState } from "@/redux/store";
import { Search } from "react-feather";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigator = useNavigate();
  const userData: any = useSelector((state: RootState) => state.auth.user);
  const { data: products, isLoading } = useGetProducts();

  return (
    <section>
      <div className="container">
        <div>
          <p className="capitalize">hi, {userData && userData.name}</p>
          <h2 className="text-2xl font-bold">
            What are you looking for today?
          </h2>
        </div>
        <div className="my-4">
          <IconInput
            type="search"
            className="border"
            icon={Search}
            onClick={() => navigator("/search")}
            placeholder="Search by Name"
          />
        </div>
        <Products productList={products} isLoading={isLoading} />
      </div>

      {/* <div className="mb-4 px-6 flex gap-2 overflow-x-auto">
        <Banner
          title="TMA-2 Modular Headphone"
          imagePath={headSet}
          slug="/headset"
        />
        <Banner
          title="TMA-2 Modular Headphone"
          imagePath={headSet}
          slug="/headset"
        />
      </div> */}

      {/* <div className="innerContainer"> */}
      {/* <CategoryList /> */}
      {/* <div className="space-y-2"></div> */}
      {/* <Products productList={products} isLoading={isLoading} /> */}
      {/* </div> */}
    </section>
  );
};

export default HomePage;
