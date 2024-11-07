import React, { useEffect, useState } from "react";
import { getRequest } from "../../Utils/RequestHelper";
import Order from "../../types/order";

function Orders() {
	const [orders, setOrders] = useState<Order[]>([]);

	async function onInit() {
		const orderInfo = await getRequest<{orders: Order[]}>("/api/books/own");
        if(orderInfo && orderInfo.data) {
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
                    <td><b>{o.books.reduce((acc, b) => acc + b.book.price * b.quantity, 0)}</b></td>
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
						<th scope="col">Quantity</th>
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
