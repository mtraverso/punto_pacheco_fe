import {createContext} from "react";
import {User} from "../users/User";

export interface AuthContextData {
    user: User | null;
    setUser: (user: User | null) => void;
    token: string | null;
    setToken: (token: string | null) => void;
    login: (username: string, password: string) => Promise<object>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextData>({
    user: null,
    token: null,
    // @ts-ignore
    login: async (username: string, password: string) => {
    },
    logout: () => {
    },
    setUser: (user: User | null) => {
    },
    setToken: (token: string | null) => {
    },
    role: null,
    setRole: (role: string | null) => {
    }
});


export default AuthContext;