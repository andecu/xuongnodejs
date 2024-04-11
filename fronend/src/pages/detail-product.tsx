import { getProductById } from "@/services/products";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {  Link, useParams } from "react-router-dom"
import BoxLeft from "./box-left";
import "@/detail.css"

const DetailProduct = () => {
    const { id } = useParams();
    const { data: product, isLoading } = useQuery({
        queryKey: ["PRODUCT_KEY", id],
        queryFn: async () => await getProductById(id as string),
    });
    console.log(product)
    const { data: relatedProduct } = useQuery({
        queryKey: ["RELATED_PRODUCT_KEY", id],
        queryFn: async () => {
            const { data } = await axios.get(`http://localhost:8080/api/v1/products/${product.category}/related`);
            return data;
        },
    });
    if (isLoading) return <p>Loading...</p>
    const newPrice = product.price - (product.price * (product.discount / 100));
    return (
        <main>
            <div className="detail-product">
                <BoxLeft />
                <div className="box-center">
                    <img src={product?.image} alt="" style={{ width: "500px", height: "300px", marginLeft: "50px" }} />
                </div>
                <div className="box-right">
                    <div className="product_name">
                        <h2>{product?.name}</h2>
                    </div>
                    <div className="price">
                        <h3>{newPrice}Đ</h3>
                    </div>
                    <div className="desciption">
                        <p>{product?.description}</p>
                    </div>
                    <div className="addToCart">
                        <div className="selectQuantity">
                            <div className="minus"><i className="fa-solid fa-minus" /></div>
                            <div className="quantity">1</div>
                            <div className="plus"><i className="fa-solid fa-plus" /></div>
                        </div>
                        <div className="add">
                            <p>Add To Cart</p>
                        </div>
                        <div className="compare">
                            <p>Compare</p>
                        </div>
                    </div>
                    <hr style={{ color: '#D9D9D9', marginTop: 50 }} />
                    <div className="parameter">
                        <div className="child-parameter">
                            <p className="p1">SKU</p>
                            <p>: SS001</p>
                        </div>
                        <div className="child-parameter">
                            <p className="p1">Category</p>
                            <p>: Sofas</p>
                        </div>
                        <div className="child-parameter">
                            <p className="p1">Tags</p>
                            <p>:{product?.tag}</p>
                        </div>
                        <div className="child-parameter">
                            <p className="p1">Share</p>
                            <div className="icon"> : <a href="https://www.facebook.com/andecu24"><i className="fa-brands fa-facebook" /></a>
                                <a href=""><i className="fa-brands fa-twitter" /></a>
                                <a href=""><i className="fa-brands fa-instagram" /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr style={{ color: '#D9D9D9', marginTop: 50 }} />
            <div>
                <div className="desciption-section1">
                    <div className="title">
                        <h3>Description</h3>
                        <h3 style={{ color: '#9F9F9F' }}>Additional Information</h3>
                        <h3 style={{ color: '#9F9F9F' }}>Reviews [5]</h3>
                    </div>
                    <div className="desciption">
                        <p>Embodying the raw, wayward spirit of rock n roll, the Kilburn portable active stereo speaker
                            takes the unmistakable look and sound of Marshall, unplugs the chords, and takes the show on the
                            road.</p>
                        <p style={{ marginTop: 40 }}>Weighing in under 7 pounds, the Kilburn is a lightweight piece of
                            vintage styled engineering. Setting the bar as one of the loudest speakers in its class, the
                            Kilburn is a compact, stout-hearted hero with a well-balanced audio which boasts a clear
                            midrange and extended highs for a sound that is both articulate and pronounced. The analogue
                            knobs allow you to fine tune the controls to your personal preferences while the
                            guitar-influenced leather strap enables easy and stylish travel.</p>
                    </div>
                    <div className="image-des">
                        <img src="/images/Group 107.png" alt="" />
                        <img src="/images/Group 107.png" alt="" />
                    </div>
                </div>
                <hr style={{ color: '#D9D9D9', marginTop: 50 }} />
                <div className="relatedProducts">
                    <h2>Related Products</h2>
                    <div className="section1" style={{ width: '90%' }}>

                        <div className="products"  style={{display: "grid", gridTemplateColumns: "(4, 1fr)"}}>
                            {relatedProduct?.map((item) => (

                                <div className="card">
                                    <div className="image-item">
                                        <a href="">
                                            <img src={item.image} alt=""  style={{ width: '300px', height: '320px' }}/>
                                        </a>
                                    </div>
                                    <div className="text-item">
                                        <h3>{item.name}</h3>
                                        <p>Stylish cafe chair</p>
                                    </div>
                                    <div className="discount">
                                        <h4>{newPrice}Đ</h4>
                                        <del>{product.price}</del>
                                    </div>
                                    <div className="overlay">
                <div className="overlay-content">
                <Link to={`/products/${item._id}`} style={{ backgroundColor: '#fff' }}>View Product</Link>
                  <a href="" style={{ backgroundColor: '#fff' }}>Add to Cart</a>
                  <div className="secondary-buttons">
                    <a href="#"><i className="fa-solid fa-share"></i> Share</a>
                    <a href="#"><i className="fa-solid fa-code-compare"></i> Compare</a>
                    <a href="#"><i className="fa-regular fa-heart"></i> Like</a>
                  </div>
                </div>
              </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="more">
                        <p style={{marginLeft: "600px"}}>Show more</p>
                    </div>
                    <hr style={{ color: '#D9D9D9', marginTop: 50 }} />
                </div>
            </div>

        </main>
    )
}

export default DetailProduct