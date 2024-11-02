import { Product } from "../models/product"
import { Request, Response } from "express"


export const getProducts = async (req: Request, res: Response) => {
    const products = await Product.find()
    res.json(products)
}

//create products
export const createProduct = async (req: Request, res: Response) => {
    const newProduct = req.body

    const savedProduct = await Product.create(newProduct)

    res.json(savedProduct)
}