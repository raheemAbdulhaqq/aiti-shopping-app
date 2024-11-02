import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"
import dotenv from "dotenv"

dotenv.config()

const tokenSecret = process.env.TOKEN_SECRET!
const tokenExpiration = "1 day"

export const generateToken = function (payload: any){
    return jwt.sign(payload, tokenSecret, {
        expiresIn: tokenExpiration
    })
}

/*
This is the auth middleware function

1. It gets the jwt token from our request header(authorization)
2. Verifies token by using the verify function from jwt module and it takes the token
    and token scret as parameters

*/
export const auth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.replace("Bearer", "")

    if(!token){
        throw new Error()
    }

    jwt.verify(token, tokenSecret)

    next()
}