import { Schema, model } from "mongoose"

interface CartProduct{
    productId: Schema.Types.ObjectId,
    quantity: number
}

interface User{
    name: string
    email: string
    password: string
    cartProducts: CartProduct[]
}

const CartProductSchema = new Schema<CartProduct>({
    productId: {type: Schema.Types.ObjectId, ref: "product"},
    quantity: {type: Number, required: true}
})

const userSchema = new Schema<User>({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    cartProducts: {type: [CartProductSchema], default: []}
})

export const User = model<User>("User", userSchema)