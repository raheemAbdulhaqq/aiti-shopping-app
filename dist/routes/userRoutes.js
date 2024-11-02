"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = require("../controllers/User");
const router = (0, express_1.Router)();
//Get user(s)
router.get("/", User_1.getUsers);
//create users
router.post("/", User_1.createUser);
//sign in users
router.post("/signin", User_1.signIn);
//add product to cart
router.post("/addToCart", User_1.addProductToCart);
exports.default = router;
