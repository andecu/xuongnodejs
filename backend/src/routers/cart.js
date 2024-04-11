import { Router } from 'express';
import { addItemToCart, getCartById, order, removeFromCart, updateProductQuantity } from '../controllers/cart';


const router = Router();
router.get("/cart/:userId", getCartById)
router.post("/cart/add-to-cart", addItemToCart)
router.delete("/cart/remove-from-cart/:userId/:productId", removeFromCart)
router.put("/cart/update-product-quantity", updateProductQuantity)
router.post("/order", order)
export default router;