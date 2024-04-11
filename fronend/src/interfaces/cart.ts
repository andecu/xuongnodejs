import { IProduct } from "./product";

export interface ICart {
  count: number;
  productId: number;
  id: number;
}

export interface ICartList {
  quantity: number;
  productId: IProduct;
  name: string
  _id: string;
}
