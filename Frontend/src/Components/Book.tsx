import { patchRequest } from "../Utils/RequestHelper";
import UserContext from "../Context/UserContext";
import { useContext } from "react";

function Book(props: {
	id: number;
	title: string;
	author: string;
	stock: number;
	price: number;
	limited: boolean;
}) {
	// Bit more readable than .props on everything
	const { title, author, stock, price, limited, id } = props;
	const inStock = stock > 0;

	const { username } = useContext(UserContext);

	async function restock() {
		const restockBy = 10;
		const restockRequest = await patchRequest(
			`/api/books/${id}/restock/${restockBy}`,
			{}
		);
		if (restockRequest?.success) {
			console.log(`Restocked ${restockBy}`);
		}
	}

	function RestockButton() {
		if (username === "" || !username) {
			return null;
		}

		return (
			<div className="col-auto">
				<button className="btn btn-warning mt-2" onClick={restock}>
					Restock
				</button>
			</div>
		);
	}

	return (
		<>
			<h3>{title}</h3>
			<h5>{author}</h5>
			<div className="row mt-5">
				<div className="col">
					<p>{price} :-</p>
					<small className={inStock ? "" : "text-muted"}>
						{inStock
							? stock +
							  " in stock" +
							  (limited ? " (limited!)" : "")
							: "Out of stock"}
					</small>
				</div>
				<RestockButton />
			</div>
			<div className="mt-3">
				<button className="btn btn-primary w-100" disabled={stock <= 0}>
					Buy
				</button>
			</div>
		</>
	);
}

export default Book;
