import {Router, Request, Response} from "express"
import { createProduct, getProducts } from "../controllers/Product"

const router = Router()

//Get product(s)
router.get("/", getProducts)

//create products
router.post("/", createProduct)

export default router