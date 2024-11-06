import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { cors } from "hono/cors";
import { timing } from "hono/timing";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";
import "dotenv/config";

const defaultToken = "makesuretochangethis";
const token: string = process.env.GENERAL_PASSWORD ?? defaultToken;
if (token === defaultToken) {
	console.warn("Add a proper secret to the .env file, currently using default.");
}

const app = new Hono();

app.use("*", cors({
	origin: ["http://localhost:3000", "http://localhost:5173", "http://localhost:8000"], // Usual dev ports
	credentials: true
}));
app.use("*", secureHeaders());
app.use("*", timing());
app.use("*", logger());
app.use("*", prettyJSON());

app.use("/api/*", bearerAuth({ token }));

serve({fetch: app.fetch, port: 4000}, (info) => {
	console.log(`Listening on http://localhost:${info.port}`); // Listening on http://localhost:4000
});

export default app;
