import { createContext } from "react";

const userContext = createContext({
    username: "",
    setUsername: (username: string) => {}, // eslint-disable-line @typescript-eslint/no-unused-vars
});

export default userContext;