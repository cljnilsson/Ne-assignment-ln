import { DataSource } from "typeorm";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AppDataSource = new DataSource({
	type: "sqlite",
	database: "main.db",
	entities: [__dirname + "/../models/*.{js,ts}"],
	synchronize: true
});

AppDataSource.initialize();

export default AppDataSource;
