import {Router} from "express"
import { addToCart, removeFromCart, testCalculateTotalCost, updateProductInCart } from "../controllers/Cart"

const router = Router()

//add product to cart
router.post("/addToCart", addToCart)

router.post("/removeFromCart", removeFromCart)

router.post("/updateProductInCart", updateProductInCart)

router.post("/testCalculateTotalCost", testCalculateTotalCost)

export default router