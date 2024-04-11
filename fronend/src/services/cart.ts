import instance from "@/configs/axios";
import { ICartList } from "@/interfaces/cart";

export const getCartList = async () => {
  return await instance.get<ICartList[]>("orders?_expand=product");
};
export const getCartByUserid = async (id: string) => {
  return await instance.get<ICartList>("/cart/" + id);
};
export const addtoCartUser = async (
  buyCount: number,
  userId: string,
  idProduct: string
) => {
  return instance.post<{ userId: string; buyCount: number; idProduct: number }>(
    "cart/add-to-cart",
    {
      quantity: buyCount,
      userId,
      productId: idProduct,
    }
  );
};
export const descCount = async ({
  userId,
  productId,
  quantity,
}: {
  userId: string;
  productId: string;
  quantity: number;
}) => {
  return instance.put<ICartList>("/cart/update-product-quantity", {
    userId,
    productId,
    quantity,
  });
};
export const deleteCart = async (idcart: string, idUser: string) => {
  
  return await instance.delete<ICartList>(
    `/cart/remove-from-cart/${idUser}/${idcart}`
  );
};
