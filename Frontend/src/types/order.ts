import Book from './book';

interface Order {
	books: { book: Book; quantity: number }[];
}

export default Order;
