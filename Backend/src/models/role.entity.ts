import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Min } from "class-validator";

@Entity()
class Role {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "varchar" })
	@Min(3)
	name: string;

	@Column("boolean")
	staff: boolean; // Simplified but functional for my purposes

	@CreateDateColumn()
	created: Date;

	@UpdateDateColumn()
	updated: Date;
}

export default Role;
