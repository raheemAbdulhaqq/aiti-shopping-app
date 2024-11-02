"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addProductToCart = exports.signIn = exports.createUser = exports.getUsers = void 0;
const auth_1 = require("../middleware/auth");
const user_1 = require("../models/user");
//Get user(s)
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_1.User.find();
    res.json(users);
});
exports.getUsers = getUsers;
//create users
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = req.body;
    const savedUser = yield user_1.User.create(newUser);
    res.json(savedUser);
});
exports.createUser = createUser;
//sign in users
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const foundUser = yield user_1.User.findOne({ email });
    if (!foundUser) {
        res.status(404).json({ message: "user not found" });
    }
    if (password !== (foundUser === null || foundUser === void 0 ? void 0 : foundUser.password)) {
        res.status(400).json({ message: "email or password invalid" });
    }
    const userObject = {
        id: foundUser === null || foundUser === void 0 ? void 0 : foundUser.id.toString(),
        name: foundUser === null || foundUser === void 0 ? void 0 : foundUser.name,
        password: foundUser === null || foundUser === void 0 ? void 0 : foundUser.password
    };
    const token = (0, auth_1.generateToken)(userObject);
    res.status(200).json(token);
});
exports.signIn = signIn;
//add product to cart
const addProductToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, productId } = req.body;
    const foundUser = yield user_1.User.findOne({ email });
    foundUser === null || foundUser === void 0 ? void 0 : foundUser.products.push(productId);
    yield (foundUser === null || foundUser === void 0 ? void 0 : foundUser.save());
    res.status(200).json(foundUser);
});
exports.addProductToCart = addProductToCart;
