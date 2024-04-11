import instance from "@/configs/axios";
import { IProduct } from "@/interfaces/product";

export const getAllProducts = async(): Promise<IProduct[]> => {
    try {
        const response = await instance.get('/products')
        return response.data
    } catch (error) {
        return [];
    }
}
export const getProductById = async(id: number | string)=> {
    try {
        const response = await instance.get(`/products/${id}`)
        return response.data
    } catch (error) {
        console.error(error);
    }
}
export const addProduct = async(product: IProduct)=> {
    try {
        const response = await instance.post(`/products`, product);
        return response.data
    } catch (error) {
        console.error(error);
    }
}
export const editProduct = async (product: IProduct) => {
    try {
        const response = await instance.put(`/products/${product._id}`, product)
        return response.data
    } catch (error) {
        console.log(error)
    }
}