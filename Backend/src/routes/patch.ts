import app from "../server.js";
import Book from "../models/book.entity.js";
import db from "../db/db.js";
import { defaultJson, errorJson } from "../utils/responses.js";
import { Context } from "hono";

const bookRepository = await db.getRepository(Book);

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

	book.stock += amount;
	await bookRepository.save(book);

	return defaultJson(c, {}, "Marked as restocked!");
});
