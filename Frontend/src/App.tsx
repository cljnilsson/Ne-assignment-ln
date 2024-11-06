import { useState, useEffect } from "react";
import Book from "./Components/Book";
import "./App.css";
import Nav from "./Components/Nav.tsx";
import SearchContext from "./Context/SearchContext";
import UserContext from "./Context/UserContext";
import { Outlet, Routes, Route } from "react-router-dom";
import LoginPage from "./Routes/Login/Login";
import OrderPage from "./Routes/Orders/Orders.tsx";
import { getRequest, postRequest } from "./Utils/RequestHelper";

function App() {
	const [books, setBooks] = useState<
		{
      id: number
			title: string;
			author: string;
			price: number;
			limited: boolean;
			stock: number;
		}[]
	>([]);

	const [searchString, setSearchString] = useState<string>("");
	const [username, setUsername] = useState<string>("");

	async function onInit() {
		const userInfo = await getRequest("/api/user/info");

		// Weakest part of the project, with more time I would have made something that scales better
		if (userInfo && userInfo.success && "username" in userInfo.data && typeof userInfo.data.username === "string") {
			setUsername(userInfo.data.username);
		} else if (!userInfo || userInfo.success) {
			console.warn("could not find user based on token");
		}

		const booksInfo = await getRequest("/api/books");
		console.log(booksInfo);
		if (booksInfo && booksInfo.success && booksInfo.data && "books" in booksInfo.data && booksInfo.data.books instanceof Array) {
			setBooks(booksInfo.data.books);
		}
	}

	useEffect(() => {
		onInit();
	}, []);

	return (
		<SearchContext.Provider value={{ searchString, setSearchString }}>
			<UserContext.Provider value={{ username, setUsername }}>
				<Nav />
				<Routes>
					<Route path="/login" element={<LoginPage />} />
					<Route path="/orders" element={<OrderPage />} />
					<Route
						path="/"
						element={
              <>
							<div className="row">
								{books
									.filter((book) =>
										book.title.includes(searchString)
									)
									.map((book, index) => (
										<div
											className="col-6 col-md-4 mt-5"
											key={"ubook-" + index}
										>
											<Book
                        id={book.id}
												limited={book.limited}
												title={book.title}
												author={book.author}
												stock={book.stock}
												price={book.price}
											/>
										</div>
									))}
							</div>
              <div className="row mt-5">
                  <div className="col">
                      <p>Ultra primitive cart simulation (no way I am doing it properly in the time limit), buy hardcoded items</p>
                      <button className="btn btn-danger" onClick={async () => {
                        const orderInfo = await postRequest("/api/books/buy", {toBuy: [{id: books[0].id, quantity: 20}, {id: books[1].id, quantity: 1}]});
                        console.log("order", orderInfo);
                      }}>Place order</button>
                  </div>
              </div>
              </>
						}
					/>
				</Routes>
				<Outlet />
			</UserContext.Provider>
		</SearchContext.Provider>
	);
}

export default App;
