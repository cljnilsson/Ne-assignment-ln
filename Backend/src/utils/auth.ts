import db from "../db/db.js";
import User from "../models/user.entity.js";
import jwt from "jsonwebtoken";

type PayLoad = { username: string; id: number; iat: number; exp: number };

const JWT_SECRET = process.env.JWT_SECRET;
const userRepository = await db.getRepository(User);

export async function validateLogin(token: string): Promise<boolean> {
	let isValid: boolean;

	try {
		const payload = jwt.verify(token, JWT_SECRET) as PayLoad;
		const forUser = payload.id;
		const user = await userRepository.findOneBy({ id: forUser });

		if (!user) {
			console.warn("Token is valid but the user it represents does not exist");
			return false;
		}

		if (user.token === token) {
			isValid = true;
		} else {
			console.warn("The token is valid and the user exists but it is outdated (not expired).");
			isValid = false;
		}
	} catch (e) {
		console.warn(e);
		isValid = false;
	}

	return isValid;
}