import { connect } from "mongoose"
import dotenv from "dotenv"

dotenv.config()

//const uri = "mongodb://localhost:27017/aiti-ts"
const uri = process.env.MONGO_URL!

export const connectToDb = async (): Promise<void> => {
    await connect(uri)

    console.log("connected to the db")
}