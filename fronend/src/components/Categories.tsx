import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Link } from "react-router-dom";

const Categories = () => {
    const { data: categories } = useQuery({
        queryKey: ["CATEGORY_LIST"],
        queryFn: async () => {
            const { data } = await axios.get("http://localhost:8080/api/v1/categories");
            return data

        }
    })
    console.log(categories)
    return (
        <div>
            <div className="section1">
                <div className="title-section1">
                    <h3>Danh mục sản phẩm</h3>
                </div>
                {categories?.map((category: { _id?: number; name: string }) => (
                    <div key={category._id}>
                        <h3>
                            <Link to={`/categories/${category._id}`}>{category.name}</Link>
                        </h3>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default Categories