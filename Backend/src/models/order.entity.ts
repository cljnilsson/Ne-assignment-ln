import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany, ManyToOne, JoinTable, UpdateDateColumn } from "typeorm";
import { Min } from "class-validator";
import User from "./user.entity";
import OrderItem from "./orderItem.entity";

@Entity()
class Order {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToMany(() => OrderItem, { eager: true, cascade: true })
	@JoinTable()
	books: OrderItem[];

	@ManyToOne(() => User, { eager: true })
	owner: User;

	@CreateDateColumn()
	created: Date;

	@UpdateDateColumn()
	updated: Date;
}

export default Order;