import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Min } from "class-validator";

@Entity()
class Book {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "varchar" })
	@Min(3)
	title: string;

	@Column({ type: "varchar" })
	@Min(3)
	author: string;

	@Column("integer")
	price: number;

	@Column("integer")
	stock: number;

	@Column("boolean")
	limited: boolean;

	@CreateDateColumn()
	created: Date;

	@UpdateDateColumn()
	updated: Date;
}

export default Book;
