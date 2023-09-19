import { createContext, useContext } from "react";

export const UserContext = createContext(null);
export const [user, setUser] = useContext({ userUID: null });
