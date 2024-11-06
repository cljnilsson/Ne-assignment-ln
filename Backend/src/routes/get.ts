import app from "../server.js";
import jwt from "jsonwebtoken";
import db from "../db/db.js";
import User from "../models/user.entity.js";
import Book from "../models/book.entity.js";
import Order from "../models/order.entity.js";
import OrderItem from "../models/orderItem.entity.js";
import { defaultJson, errorJson } from "../utils/responses.js";
import { validateLogin } from "../utils/auth.js";
import { Context } from "hono";
import { getSignedCookie } from "hono/cookie";

const JWT_SECRET = process.env.JWT_SECRET;

const userRepository = await db.getRepository(User);
const bookRepository = await db.getRepository(Book);
const orderRepository = await db.getRepository(Order);
const orderItemRepository = await db.getRepository(OrderItem);

app.get("/api/user/info", async (c: Context) => {
	const token = await getSignedCookie(c, JWT_SECRET, "token");
	if (!token) {
		return errorJson(c, "Token is not matching signature");
	}

	const isValid: boolean = await validateLogin(token);

	if (isValid) {
		const decoded: any = jwt.decode(token);
		const user = await userRepository.findOneBy({ username: decoded.username });
		return defaultJson(c, { username: decoded.username, role:  {name: user.role.name, staff: user.role.staff}}, "User info retrieved");
	}

	return errorJson(c, "Token is not valid");
});

app.get("/api/books", async (c: Context) => {
	// No validation because hono is configured prior to require a bearer token to access this API and is not user restricted
	const books = await bookRepository.find();
	return defaultJson(c, { books: books }, "Books retrieved");
});

app.get("/api/books/own", async (c: Context) => {
	const user = await userRepository.findOneBy({ username: "admin" });
	const orders = await orderRepository.find({
		where: {
			owner: {
				id: user.id
			}
		}
	});

	for(const o of orders) {
		delete o.owner; // Sensitive information by default from eager loading, also not useful for this endpoint since the user know who they are
	}

	console.log(orders);
	console.log(await orderItemRepository.find());

	return defaultJson(c, { orders: orders }, "Orders retrieved");
});
