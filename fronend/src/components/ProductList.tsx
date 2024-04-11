import { IProduct } from "@/interfaces/product";
import { addtoCartUser } from "@/services/cart";
import { getAllProducts } from "@/services/products";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type ProductListProps = {
  featured?: boolean;
  data?: IProduct[];
};

const ProductList = ({ featured, data }: ProductListProps) => {
  const navigate = useNavigate();
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["PRODUCT_KEY"],
    queryFn: getAllProducts,
  });

  const filteredProducts = featured
    ? products?.filter((product: IProduct) => product?.featured == featured)
    : data
    ? data
    : products;

  const handleAddToCart = (idProduct: string) => {
    const user = localStorage.getItem("user");
    const userExit = user ? JSON.parse(user) : null;
    // dont login dont have in localstorage =>login
    if (!userExit) {
      toast.error("You Login to Order");
      navigate("/signin");
    }
    addtoCartUser(1, userExit.userId._id, idProduct).then(() => {
      toast.success("Dat hang thanh cong");
    });
  };
  if (isLoading) return <p>Loadding...</p>;
  if (isError) return <p>Error</p>;
  return (
    <div>
      <hr />
      <div
        className="products"
        style={{ display: "grid", gridTemplateColumns: "(4, 1fr)" }}
      >
        {filteredProducts?.map((product: IProduct, index: number) => {
          const newPrice =
            product.price - product.price * (product.discount / 100);

          return (
            <div className="card" key={index}>
              <div className="image-item">
                <a href="">
                  <img
                    src={product?.image}
                    alt=""
                    style={{ width: "300px", height: "320px" }}
                  />
                </a>
              </div>
              <div className="text-item">
                <h3>{product?.name}</h3>
                <p>{product?.description}</p>
              </div>
              <div className="discount">
                <h4>{newPrice}Đ</h4>
                <del>{product.price}</del>
              </div>
              <div className="overlay">
                <div className="overlay-content">
                  <Link
                    to={`/products/${product._id}`}
                    style={{ backgroundColor: "#fff" }}
                  >
                    View Product
                  </Link>
                  <a
                    href="#"
                    style={{ backgroundColor: "#fff" }}
                    onClick={() => handleAddToCart(product?._id as string)}
                  >
                    Add to Cart
                  </a>
                  <div className="secondary-buttons">
                    <a href="#">
                      <i className="fa-solid fa-share"></i> Share
                    </a>
                    <a href="#">
                      <i className="fa-solid fa-code-compare"></i> Compare
                    </a>
                    <a href="#">
                      <i className="fa-regular fa-heart"></i> Like
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <hr />
      {/* </div> */}
    </div>
  );
};

export default ProductList;
