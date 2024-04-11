import {Router} from 'express'
import { addItemToCart, getCartById, removeFromCart, updateProductQuantity } from '../controllers/cart';
import { updateProductById } from '../controllers/product';
const router = Router();
router.get("/cart/:userId", getCartById)
router.post("/cart/add-to-cart", addItemToCart)
router.delete("/cart/remove-from-cart", removeFromCart)
router.put  ("/cart/update-product-quantity", updateProductQuantity)
export default router;