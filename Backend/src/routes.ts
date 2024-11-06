import app from "./server.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "./db/db.js";
import User from "./models/user.entity.js";
import Book from "./models/book.entity.js";
import { defaultJson, errorJson } from "./utils/responses.js";
import { validateLogin } from "./utils/auth.js";
import { Context } from "hono";
import { getSignedCookie, setSignedCookie, deleteCookie } from "hono/cookie";

const JWT_SECRET = process.env.JWT_SECRET ?? "default_secret";
if (JWT_SECRET === "default_secret") {
	console.warn("Using default jwt secret, change this in the .env file");
}

const userRepository = await db.getRepository(User);
const bookRepository = await db.getRepository(Book);

type LoginInput = { username: string; password: string };
app.post("/api/login", async (c: Context) => {
	const MAX_LOGIN_ATTEMPTS = 3;
	try {
		const body = (await c.req.json()) as LoginInput;
		if (!body) return errorJson(c, "The request payload is required");

		const user = await userRepository.findOneBy({ username: body.username });
		if (user === null || !bcrypt.compareSync(body.password, user.hashed_password)) {
			if (user) {
				user.loginAttempts += 1;
				user.lastLogin = new Date();
				await userRepository.save(user);
			}

			return errorJson(c, "Invalid credentials");
		}

		if (user?.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
			return errorJson(c, "Maximum login attempts exceeded. Please try again later."); // Chronjob to reset this later
		}

		console.log(user);
		const newToken = jwt.sign({ username: user.username, id: user.id }, JWT_SECRET, { expiresIn: "30d" });

		user.token = newToken;
		user.loginAttempts = 0;
		user.lastLogin = new Date();

		userRepository.save(user);

		await setSignedCookie(c, "token", newToken, JWT_SECRET, {
			path: "/",
			secure: false, // only works with https(?)
			httpOnly: true,
			maxAge: 3600, // one hour
			sameSite: "Strict"
		});

		return defaultJson(c, {}, "Login successful");
	} catch (e) {
		return errorJson(c, "Invalid body");
	}
});

app.get("/api/user/info", async (c: Context) => {
	const token = await getSignedCookie(c, JWT_SECRET, "token");
	if (!token) {
		return errorJson(c, "Token is not matching signature");
	}

	const isValid: boolean = await validateLogin(token);

	if (isValid) {
		const decoded: any = jwt.decode(token);
		return defaultJson(c, { username: decoded.username }, "User info retrieved");
	}

	return errorJson(c, "Token is not valid");
});

app.get("/api/books", async (c: Context) => {
	// No validation because hono is configured prior to require a bearer token to access this API and is not user restricted
	const books = await bookRepository.find();
	return defaultJson(c, { books: books }, "Books retrieved");
});

type BuyInput = { toBuy: { id: number; quantity: number }[] };
app.post("/api/books/buy", async (c: Context) => {
	// No validation because hono is configured prior to require a bearer token to access this API and is not user restricted

	const body = (await c.req.json()) as BuyInput;
	if (!body) return errorJson(c, "The request payload is required");

	const priceLimit = 120;

	let totalPrice = 0;
	const reciet: { id: number; quantity: number; title: string; author: string; price: number }[] = []; // Basically a slightly altered book array

	// First loop to validate and gather info
	for (const item of body.toBuy) {
		const book = await bookRepository.findOneBy({ id: item.id });

		if (!book) {
			return errorJson(c, `Book with ID ${item.id} not found.`);
		}

		if (book.stock < item.quantity) {
			return errorJson(c, `Insufficient stock for book with ID ${item.id}. Available stock: ${book.stock}, requested: ${item.quantity}`);
		}

		totalPrice += book.price * item.quantity;
		reciet.push({ id: book.id, quantity: item.quantity, title: book.title, author: book.author, price: book.price });
	}

	if (totalPrice >= priceLimit) {
		return errorJson(c, `The total price exceeds the limit of $${priceLimit}`);
	}

	// Second loop to handle the actual purchase once everything is validated
	for (const item of body.toBuy) {
		const book = await bookRepository.findOneBy({ id: item.id });

		book.stock -= item.quantity;
		await bookRepository.save(book);
	}

	return defaultJson(c, { books: reciet, price: totalPrice }, "Order placed");
});

// Still somewhat unsure if I prefer :amount over body data
app.patch("/api/books/:id/restock/:amount", async (c: Context) => {
	const id = parseInt(c.req.param("id"));
	const amount = parseInt(c.req.param("amount"));

	// Validate id and amount
	if (isNaN(id) || id <= 0) {
		return errorJson(c, "Invalid book ID. It must be a positive number.");
	}

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

	book.stock += amount;
	await bookRepository.save(book);

	return defaultJson(c, {}, "Marked as restocked!");
});

// Maybe should be renamed like invalidateToken
app.post("/api/logout", async (c: any) => {
	const token = await getSignedCookie(c, JWT_SECRET, "token");
	if (!token) {
		return errorJson(c, "Token is not matching signature");
	}

	const isValid: boolean = await validateLogin(token);

	if (isValid) {
		const decoded: any = jwt.decode(token);
		const user = await userRepository.findOneBy({ id: decoded.id });
		if (user) {
			deleteCookie(c, "token", { path: "/", secure: false, httpOnly: true, sameSite: "Strict" }); // very picky with options
			user.token = null;
			userRepository.save(user);
			return defaultJson(c, {}, "Logout successful");
		}
	}

	return errorJson(c, "Token is not valid");
});
