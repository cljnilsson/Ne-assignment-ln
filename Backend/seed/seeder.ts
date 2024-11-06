import "reflect-metadata";
import { DataSource } from "typeorm";
import path from "path";
import { fileURLToPath } from "url";
import User from "../src/models/user.entity";
import Book from "../src/models/book.entity";
import Order from "../src/models/order.entity";
import OrderItem from "../src/models/orderItem.entity";
import bcrypt from "bcryptjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new DataSource({
	type: "sqlite",
	database: "main.db",
	entities: [__dirname + "/../**/*.entity.{js,ts}"],
	synchronize: true
});

await db.initialize();

const resetDB = true;

if (resetDB) {
	await db.getRepository(OrderItem).clear();
	await db.getRepository(Book).clear();
	await db.getRepository(Order).clear();
	await db.getRepository(User).clear();
}

await makeBook("Fellowship of the book", "J.R.R. Tolkien", 5, 10, false);
await makeBook("Books and the chamber of books", "J.K Rowling", 10, 10, false);
await makeBook("The return of the book", "J.R.R. Tolkien", 5, 10, false);
await makeBook("Limited Collectors Edition", "Fancy Author", 75, 10, true);

await makeUser("Uncle_Bob_1337", "TomCruiseIsUnder170cm");
await makeUser("admin", "admin"); // easier to remember

async function makeUser(name: string, password: string): Promise<User> {
	const user = new User();
	user.username = name;
	user.lastLogin = new Date();
	user.loginAttempts = 0;

	const hashed = await bcrypt.hash(password, 10);

	user.hashed_password = hashed;
	db.getRepository(User).save(user);

	return user;
}

async function makeBook(title, author, price, stock, limited): Promise<Book> {
	const book = new Book();
	book.title = title;
	book.author = author;
	book.price = price;
	book.stock = stock;
	book.limited = limited;

	await db.getRepository(Book).save(book);
	return book;
}