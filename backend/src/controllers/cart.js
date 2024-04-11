import Cart from '../models/cart'
import Order from '../models/order'
import Product from '../models/product'
import User from '../models/user'
import { StatusCodes } from 'http-status-codes'


export const getCartById = async (req, res) => {
    const { userId } = req.params;
    try {
        const cart = await Cart.findOne({ userId }).populate("products.productId");

        const cartData = {
            products: cart.products.map((item) => ({
                _id: item._id,
                productId: item.productId,
                name: item.productId.name,
                quantity: item.quantity,
            }))
        }
        return res.status(StatusCodes.OK).json({ products: cartData.products });
    } catch (error) {

    }
}

export const addItemToCart = async (req, res) => {
    const { userId, productId, quantity } = req.body;
    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, products: [] })
        }
        const existProductIndex = cart.products.findIndex((item) => item.productId.toString() == productId)
        if (existProductIndex !== -1) {
            cart.products[existProductIndex].quantity += quantity;
        } else {
            cart.products.push({ productId, quantity })
        }
        await cart.save();
        return res.status(StatusCodes.OK).json({ cart })
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "Internal Server Error" })
    }
}

export const removeFromCart = async (req, res) => {
    const { userId, productId } = req.params;

    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "Cart not found" })
        }
        cart.products = cart.products.filter((product) => product.productId && product.productId.toString() !== productId)
        await cart.save();
        return res.status(StatusCodes.OK).json({ cart });
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "Internal Server Error" })
    }
}

export const updateProductQuantity = async (req, res) => {
    const { userId, productId, quantity } = req.body;
    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "Cart not found" })
        }

        const product = cart.products.find((item) => item.productId == productId)
      
        if (!product) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "Product not found" })
        }
        product.quantity = quantity;
        await cart.save();
        return res.status(StatusCodes.OK).json({ cart });
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "Internal Server Error" })
    }
}

export const order = async (req, res) => {
    try {
        const order = await Order.create(req.body)
        return res.json(order);
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "Internal Server Error" })
    }
}