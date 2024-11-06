import "reflect-metadata";
import "./routes/get.js";
import "./routes/post.js";
import "./routes/patch.js";

const JWT_SECRET = process.env.JWT_SECRET ?? "default_secret";
if (JWT_SECRET === "default_secret") {
	console.warn("Using default jwt secret, change this in the .env file");
}