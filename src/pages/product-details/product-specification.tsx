import { Models } from "appwrite";
import Markdown from "markdown-to-jsx";

const ProductSpecification = ({
  productDetails,
}: {
  productDetails: Models.Document | undefined;
}) => {
  return (
    <div className="markdown">
      <Markdown>{productDetails && productDetails.description}</Markdown>
    </div>
  );
};

export default ProductSpecification;
