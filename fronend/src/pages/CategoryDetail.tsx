import { ProductList } from "@/components";
import { useQuery } from "@tanstack/react-query"
import axios from "axios";
import { useParams } from "react-router-dom";

const CategoryDetail = () => {
  const { id } = useParams();
 const {data, isLoading} = useQuery({
    queryKey: ["CATEGORY_DETAIL", id],
    queryFn: async () => {
     const {data} = await axios.get(`http://localhost:8080/api/v1/categories/${id}`);
     return data;
    },
  })
  if (isLoading) return <p>Loading...</p>
  return (
    <div className="container">
      <div className="title-section1">
        <h3>Danh mục: {data.category.name}</h3>
      </div>
      <hr />
      <ProductList data={data.products}/>
    </div>
  )
}

export default CategoryDetail