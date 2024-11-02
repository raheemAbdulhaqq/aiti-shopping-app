import { generateToken } from "../middleware/auth"
import { User } from "../models/user"
import { Request, response, Response } from "express"
import redisClient from "../utils/redisClient"


//Get user(s)
export const getUsers = async (req: Request, res: Response) => {
    try {
        //await redisClient.del("ip")
        
        //check if users are available in erdis cache
        // const cachedUsers = await redisClient.get("users")

        // if (cachedUsers) {
        //     //if cached users are found, return them
        //     console.log("serving users from cache")
        //     return res.json(JSON.parse(cachedUsers))
        // }

        //fetch users from the db if they are not found in cache
        const users = await User.find()

        //store the fetched users in Redis

        // await redisClient.set("users", JSON.stringify(users))
        // console.log("serving users from db")

        //return the users to the client
        res.json(users)
    } catch (error) {
        console.error("Error fetching users: ", error)
        res.status(500).json({error: "Interval Server Error"})
    }
}

//create users
export const createUser = async (req: Request, res: Response) => {
    try {
        const newUser = req.body

        const userCacheKey = "newUser"

        //invalidate the users cache
        //await redisClient.del(userCacheKey)
    
        //save new user into db
        const savedUser = await User.create(newUser)

        //await redisClient.set(userCacheKey, JSON.stringify(newUser))

        //const cachedUser = await redisClient.get(userCacheKey)
        //console.log(cachedUser)
        
        res.json(savedUser)
        
    } catch (error) {
        console.error("Error saving user: ", error)
        res.status(500).json({error: "Interval Server Error"})
    }

}

export const updateUser = async (req: Request, res: Response) => {

    try {
        
        const { email, name } = req.body
    
        if (!(email || name)) {
            return res.status(500).json({message: "email and name fields are expected"})
        }
    
        const user = await User.findOne({email: email})
    
        if (!user) {
            return res.status(404).json({message: "user not found"})
        }
    
        //invalidate cache
        await redisClient.del("users")
    
        //update user name
        user.name = name
    
        await user.save()

        await redisClient.set("users", JSON.stringify(user))
    
        const cachedUser = await redisClient.get("users")
        console.log(cachedUser)
    
        res.json(user)
        
    } catch (error) {
        console.error("Error updating user: ", error)
        res.status(500).json({error: "Interval Server Error"})
    }


}

export const deleteUser = async (req: Request, res: Response) => {
    const { email } = req.body

    if(!email){
        return res.status(404).json({message: "email field is expected"})
    }

    const user = await User.findOne({email: email})

    if(!user){
        return res.status(404).json({message: "user not found"})
    }

    await User.deleteOne({email: email})

    await redisClient.del("users")

    const cachedUsers = await redisClient.get("users")
    console.log(cachedUsers)

    return res.status(200).json({message: "user deleted successfully"})
}

//sign in users
export const signIn = async (req: Request, res: Response) => {
    //getting input from request body
    const { email, password } = req.body

    //getting a user from the db using the email from our req body
    const foundUser = await User.findOne({ email })

    if (!foundUser) {
        res.status(404).json({message: "user not found"})
    }

    if (password !== foundUser?.password) {
        res.status(400).json({message: "email or password invalid"})
    }

    const userObject = {
        id: foundUser?.id.toString(),
        name: foundUser?.name,
        password: foundUser?.password
    }

    const token = generateToken(userObject)

    res.status(200).json(token)
}

// //add product to cart
// export const addProductToCart = async (req: Request, res: Response) => {
//     const { email, productId } = req.body

//     const foundUser = await User.findOne({ email })

//     foundUser?.products.push(productId)

//     await foundUser?.save()

//     res.status(200).json(foundUser)
// }