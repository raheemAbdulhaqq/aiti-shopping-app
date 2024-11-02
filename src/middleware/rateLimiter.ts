import { NextFunction, Request, Response } from "express"
import redisClient from "../utils/redisClient"
import winston from "winston"
import { log, timeStamp } from "console"


const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [ new winston.transports.Console(),
                    new winston.transports.File({ filename: "rate-limiting.log"})
    ]
})

export const rateLimitter = (secondsWindow: number, allowedHits: number) => {

    return async (req: Request, res: Response, next: NextFunction) => {

        //GET IP
        const ip = req.header("x-forwarded-for") || req.connection.remoteAddress!
        
        //console.log(ip?.slice(0,3))
        
        const requests = await redisClient.incr("ip")
        
        console.log(requests)
        
        let ttl
        if (requests === 1) {
            await redisClient.expire("ip", secondsWindow)
            ttl = secondsWindow
        } else {
            ttl = await redisClient.ttl("ip")
        }
        
        console.log(`ttl: ${ttl}`)
        
        
        if (requests > allowedHits) {

            const logEntry = {
                ip: ip,
                requests: requests,
                message: "rate limit exceeded",
                timeStamp: new Date().toISOString()
            }

            logger.info(logEntry)

            return res.status(429).json({ message: "too many requests", retryAfter: ttl})

        } else {
            next()
        }
    }
}