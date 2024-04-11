export interface IProduct{
  _id?: number | string,
  name: string,
  category?: string,
  price: string,
  image: string,
  description: string,
  discount: string,
  featured: boolean,
  countInStock?: string,
}