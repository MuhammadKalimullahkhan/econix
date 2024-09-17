import { useGetCategories } from "@/lib/react-query/queries";
import { cn } from "@/lib/utils";
import { Link, useParams } from "react-router-dom";

const CategoryList = () => {
  const { data: categories } = useGetCategories();
  const { category } = useParams();

  return (
    <ul className="gap-1 w-full flex overflow-x-auto">
      <li className="min-w-fit">
        <Link
          to={`/category/all`}
          className={cn(
            "capitalize block py-1 px-3",
            category === "all" &&
              "bg-primary text-primary-foreground rounded-full"
          )}
        >
          all
        </Link>
      </li>
      {categories &&
        categories.documents.map((c: any, i: number) => (
          <li key={i} className="min-w-fit">
            <Link
              to={`/category/${c.$id}`}
              className={cn(
                "capitalize block py-1 px-3",
                category === c.name ||
                  (category === c.$id &&
                    "bg-primary text-primary-foreground rounded-full")
              )}
            >
              {c.name}
            </Link>
          </li>
        ))}
    </ul>
  );
};

export default CategoryList;
