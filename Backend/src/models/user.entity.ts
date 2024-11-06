import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Min} from "class-validator";
import Role from "./role.entity";

@Entity()
class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "varchar" }) // Not sure why needed to be specified
	@Min(5)
	username: string;

	@Column({ type: "varchar" })
	@Min(5)
	hashed_password: string;

	@ManyToOne(() => Role, { eager: true })
	role: Role;

	@Column({ type: "date", nullable: true })
	lastLogin: Date | null;

	@Column({ type: "int", default: 0 })
	loginAttempts: number;

	// Needs to specify type because having null as optional type makes typeorm unable to defer the type automatically
	@Column({ nullable: true, type: "varchar" })
	token: string | null;

	@CreateDateColumn()
	created: Date;

	@UpdateDateColumn()
	updated: Date;
}

export default User;
