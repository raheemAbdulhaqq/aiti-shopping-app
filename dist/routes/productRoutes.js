"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Product_1 = require("../controllers/Product");
const router = (0, express_1.Router)();
//Get product(s)
router.get("/", Product_1.getProducts);
//create products
router.post("/", Product_1.createProduct);
exports.default = router;
