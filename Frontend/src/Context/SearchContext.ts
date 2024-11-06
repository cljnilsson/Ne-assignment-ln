import { createContext } from "react";

const searchContext = createContext({
    searchString: "",
    setSearchString: (search: string) => {} // eslint-disable-line @typescript-eslint/no-unused-vars
});

export default searchContext;