import app from "../server.js";
import Book from "../models/book.entity.js";
import User from "../models/user.entity.js";
import jwt from "jsonwebtoken";
import db from "../db/db.js";
import { defaultJson, errorJson } from "../utils/responses.js";
import { Context } from "hono";
import { getSignedCookie } from "hono/cookie";
import { validateLogin } from "../utils/auth.js";

const JWT_SECRET = process.env.JWT_SECRET;

const bookRepository = await db.getRepository(Book);
const userRepository = await db.getRepository(User);

// Still somewhat unsure if I prefer :amount over body data
app.patch("/api/books/:id/restock/:amount", async (c: Context) => {
	const id = parseInt(c.req.param("id"));
	const amount = parseInt(c.req.param("amount"));

	// Validate id and amount
	if (isNaN(id) || id <= 0) {
		return errorJson(c, "Invalid book ID. It must be a positive number.");
	}

	// Validate id, amount and divisable by 10
	if (isNaN(amount) || amount <= 0 || amount % 10 !== 0) {
		return errorJson(c, "Invalid amount. It must be a positive number and divisible by 10.");
	}

	const book = await bookRepository.findOneBy({ id: id });
	if (!book) {
		return errorJson(c, "Book not found.");
	}

	if (book.limited) {
		return errorJson(c, "Cannot restock a limited book");
	}

	// Because we can't trust the client, make sure the user is logged in and has a staff role
	const token = await getSignedCookie(c, JWT_SECRET, "token");
	if (!token) {
		return errorJson(c, "Token is not matching signature");
	}

	const isValid: boolean = await validateLogin(token);

	if (isValid) {
		const decoded: any = jwt.decode(token);
		const user = await userRepository.findOneBy({ username: decoded.username });
		
		if(user.role.staff !== true) {
			return errorJson(c, "You do not have the required permissions to restock books.");

		}
		
		book.stock += amount;
		await bookRepository.save(book);

		return defaultJson(c, {}, "Marked as restocked!");
	}

	return errorJson(c, "Token invalid");
});
