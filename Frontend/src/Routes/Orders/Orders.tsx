import React, { useEffect, useState } from "react";
import { getRequest } from "../../Utils/RequestHelper";

// Simplified Order Type
type Order = {books: {book: {title: string, author: string, price: number}, quantity: number}[]};

function Orders() {
	const [orders, setOrders] = useState<Order[]>([]);
	console.log(orders);

	async function onInit() {
		const orderInfo = await getRequest("/api/books/own");
        if(orderInfo && orderInfo.data && "orders" in orderInfo.data && Array.isArray(orderInfo.data.orders)) {
            setOrders(orderInfo.data.orders);
        }
	}

	useEffect(() => {
		onInit();
	}, []);

	function OrderTableBody() {
		return orders.map((o, i: number) => (
			<React.Fragment key={"order-" + i}>
				{o.books.map((b, j: number) => (
					<tr key={"trow-" + i + "-" + j}>
						<td>{b.book.title}</td>
						<td>{b.book.author}</td>
						<td>{b.quantity}</td>
						<td>{b.book.price}</td>
					</tr>
				))}
                <tr>
                    <td colSpan={3}>Total</td>
                    <td>{o.books.reduce((acc, b) => acc + b.book.price * b.quantity, 0)}</td>
                </tr>
			</React.Fragment>
		));
	}

	return (
		<div>
			<h5>Orders</h5>
			<table className="table">
				<thead>
					<tr>
						<th scope="col">Name</th>
						<th scope="col">Author</th>
						<th scope="col">Qantity</th>
						<th scope="col">Price</th>
					</tr>
				</thead>
				<tbody>
					<OrderTableBody />
				</tbody>
			</table>
		</div>
	);
}

export default Orders;
