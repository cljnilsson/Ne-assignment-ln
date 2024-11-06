import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, UpdateDateColumn } from "typeorm";
import { Min } from "class-validator";
import Book from "./book.entity";

@Entity()
class OrderItem {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Book, { eager: true })
	book: Book;

    @Column("integer")
    quantity: number;

	@CreateDateColumn()
	created: Date;

	@UpdateDateColumn()
	updated: Date;
}

export default OrderItem;