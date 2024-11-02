import { NextFunction, Request, Response } from "express"
const Flutterwave = require("flutterwave-node-v3")
import dotenv from "dotenv"
import axios from "axios"
import { calculateTotalCost } from "../controllers/Cart"
import { User } from "../models/user"

dotenv.config()

const secKey = String(process.env.FLW_SECRET_KEY)

//intialize payment

const intiliazePayment = async (req: Request, res: Response) => {
    try {
        let { tx_ref, currency, redirect_url, email, phone_number, name} = req.body

        const amount = await calculateTotalCost(email)
        console.log(amount)

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({message: "user not found"})
        }

        console.log(user.name)

        const payload = {
            tx_ref: tx_ref,
            amount: amount,
            currency: currency,
            redirect_url: redirect_url,
            payment_options: "card",
            customer: {
                email: email,
                phone_number: phone_number,
                name: user.name
            },
            customizations:{
                title:"Payment for Goods",
                description: "Payment for XYZ Goods",
                logo:""
            }
        }

        const response = await axios.post("https://api.flutterwave.com/v3/payments", payload, {
            headers: requestHeaders()
        })
        //console.log(response)

        //clear cart
        user.cartProducts = []

        await user.save()

        //get result
        const result = response.data.data

        return result


    } catch (error) {
        console.error(error)
    }
}

function requestHeaders() {
    const headersRequest = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${secKey}`
    }

    return headersRequest
}

export default intiliazePayment
