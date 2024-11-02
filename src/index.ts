import express from "express"
import {Request, Response} from "express"
import productRoutes from "./routes/productRoutes"
import userRoutes from "./routes/userRoutes"
import cartRoutes from "./routes/cartRoutes"
import bodyParser from "body-parser"
import { auth } from "./middleware/auth"
import { connectToDb } from "./database/db"
import intiliazePayment from "./utils/flutterwave"


//creating the main express application
const app = express()

//using body parser to parse json request body
app.use(bodyParser.json())

app.use("/api/users", userRoutes)

//app.use(auth)

app.use("/api/products", productRoutes)

app.use("/api/carts", cartRoutes)

app.post("/pay", async (req: Request, res: Response) => {
    const result = await intiliazePayment(req, res)

    res.json(result)
})

connectToDb()

app.listen(3000, () => {
    console.log("server is running")
})