import { IProduct } from "@/interfaces/product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";

const ProductManagement = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['PRODUCTS_KEY'],
    queryFn: async () => {
      const { data } = await axios.get(`http://localhost:8080/api/v1/products`);
      return data;
    },
    refetchInterval: 1000,

  });
  const removeProduct = useMutation({
    mutationFn: async (_id: string | number) => {
      await axios.delete(`http://localhost:8080/api/v1/products/${_id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['PRODUCT_KEY'] });
      alert("Xóa thành công")

    },
  });
  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Error</p>

  const handleRemove = (productId: string | number) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?");
    if (confirmDelete) {
      removeProduct.mutate(productId);
    }
  };

  return (
    <div>
      <Link className="btn btn-primary" to="/admin/products/add">Thêm sản phẩm</Link>
      <table className="table" style={{ width: '1440px' }}>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Price</th>
            <th scope="col">Image</th>
            <th scope="col">Discount</th>
            <th scope="col">Featured</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {data?.map((product: IProduct, index: number) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>
                <img src={product.image} alt={product.name} style={{ width: '50px', height: '50px' }} />
              </td>
              <td>{product.discount}</td>
              <td>{product.featured ? 'Yes' : 'No'}</td>
              <td>
                <Link to={`/admin/products/${product._id}/edit`} className="btn btn-primary">Update</Link>
                <button className="btn btn-danger" style={{ marginLeft: '40px' }} onClick={() => handleRemove(product._id!)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManagement;
