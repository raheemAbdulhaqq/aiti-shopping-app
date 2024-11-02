import { Schema, model } from "mongoose"

interface Product{
    name: string
    price: string
}

const productSchema = new Schema<Product>({
    name: {type: String, required: true},
    price: {type: String, required: true}
})

export const Product = model<Product>("Product", productSchema)