import { Product } from "../models/product"
import { User } from "../models/user"
import { Request, response, Response } from "express"


//Add products to cart
export const addToCart = async (req: Request, res: Response) => {
    try {
        const { email, productId, quantity } = req.body

        const user = await User.findOne({email})

        if (!user) {
            return res.status(404).json({message: "user not found"})
        }

        const product = await Product.findById(productId)

        if (!product) {
            return res.status(404).json({message: "product not found"})
        }

        const cartItem = user.cartProducts.find((item) => item.productId.toString() === productId)

        if (cartItem) {
            cartItem.quantity += quantity
        } else {
            user.cartProducts.push({ productId, quantity})
        }

        await user.save()

        return res.status(200).json({message: "added to cart"})

    } catch (error) {
        console.error("Error fetching users: ", error)
        res.status(500).json({error: "Interval Server Error"})
    }
}

export const removeFromCart = async (req: Request, res: Response) => {
    try {
        const { email, productId } = req.body

        const user = await User.findOne({email})

        if (!user) {
            return res.status(404).json({message: "user not found"})
        }

        const product = await Product.findById(productId)

        if (!product) {
            return res.status(404).json({message: "product not found"})
        }

        user.cartProducts = user.cartProducts.filter((item) => item.productId.toString() !== productId)

        await user.save()

        return res.status(200).json({message: "removed from cart"})

    } catch (error) {
        console.error("Error fetching users: ", error)
        res.status(500).json({error: "Interval Server Error"})
    }
}

export const updateProductInCart = async (req: Request, res: Response) => {
    try {
        const { email, productId, quantity } = req.body

        if (quantity <= 0) {
            return res.status(400).json({message: "quantoty must be greater than 0"})
        }

        const user = await User.findOne({email})

        if (!user) {
            return res.status(404).json({message: "user not found"})
        }

        const product = await Product.findById(productId)

        if (!product) {
            return res.status(404).json({message: "product not found"})
        }

        const cartItem = user.cartProducts.find((item) => item.productId.toString() === productId)

        if (!cartItem) {
            return res.status(404).json({message: "product does not exist in cart"})
        }

        cartItem.quantity = quantity

        await user.save()

        return res.status(200).json({message: "product upated in cart"})

    } catch (error) {
        console.error("Error fetching users: ", error)
        res.status(500).json({error: "Interval Server Error"})
    }
}

export const calculateTotalCost = async (email: string): Promise<Number> => {
    
    //get user by email
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error("user not found")
    }

    //total cost usinf for...of loop

    let totalCost = 0

    //["beans", "rice", "meat", "chicken"]
    for (const cartItem of user.cartProducts) {

        const product = await Product.findById(cartItem.productId)

        if (product) {
            const itemCost = parseFloat(product.price) * cartItem.quantity
            totalCost += itemCost //totalCost = totalCost + itemCost
        }
    }
    return totalCost
}

export const testCalculateTotalCost = async (req: Request, res: Response) => {
    
    const { email } = req.body
    //get user by email
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error("user not found")
    }

    //total cost usinf for...of loop

    let totalCost = 0

    //["beans", "rice", "meat", "chicken"]
    for (const cartItem of user.cartProducts) {

        const product = await Product.findById(cartItem.productId)

        if (product) {
            const itemCost = parseFloat(product.price) * cartItem.quantity
            totalCost += itemCost //totalCost = totalCost + itemCost
        }
    }
    return res.status(200).json(totalCost)
}