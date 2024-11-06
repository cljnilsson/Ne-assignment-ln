import "reflect-metadata";
import { DataSource } from "typeorm";
import path from "path";
import { fileURLToPath } from "url";
import User from "../src/models/user.entity";
import Book from "../src/models/book.entity";
import Order from "../src/models/order.entity";
import OrderItem from "../src/models/orderItem.entity";
import Role from "../src/models/role.entity";
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
	await db.getRepository(Role).clear();
	await db.getRepository(OrderItem).clear();
	await db.getRepository(Book).clear();
	await db.getRepository(Order).clear();
	await db.getRepository(User).clear();
}

await makeBook("Fellowship of the book", "J.R.R. Tolkien", 5, 10, false);
await makeBook("Books and the chamber of books", "J.K Rowling", 10, 10, false);
await makeBook("The return of the book", "J.R.R. Tolkien", 5, 10, false);
await makeBook("Limited Collectors Edition", "Fancy Author", 75, 10, true);

const ownerRole = await makeRole("Owner", true);
const staffRole = await makeRole("Staff", true);
await makeRole("Customer", false); // Not used for now

await makeUser("Uncle_Bob_1337", "TomCruiseIsUnder170cm", staffRole);
await makeUser("admin", "admin", ownerRole); // easier to remember

async function makeUser(name: string, password: string, role: Role): Promise<User> {
	const user = new User();
	user.username = name;
	user.lastLogin = new Date();
	user.loginAttempts = 0;
	user.role = role;

	const hashed = await bcrypt.hash(password, 10);

	user.hashed_password = hashed;
	db.getRepository(User).save(user);

	return user;
}

async function makeBook(title: string, author: string, price: number, stock: number, limited: boolean): Promise<Book> {
	const book = new Book();
	book.title = title;
	book.author = author;
	book.price = price;
	book.stock = stock;
	book.limited = limited;

	await db.getRepository(Book).save(book);
	return book;
}

async function makeRole(name: string, staff: boolean): Promise<Role> {
	const role = new Role();
	role.name = name;
	role.staff = staff;

	await db.getRepository(Role).save(role);
	return role;
}