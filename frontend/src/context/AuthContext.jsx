import {
    createContext,
    useContext,
    useState
} from "react";

const AuthContext = createContext();

export default function AuthProvider({ children }) {

    const [user, setUser] = useState(

        JSON.parse(localStorage.getItem("user"))

    );

    const loginUser = (response) => {

        localStorage.setItem(
            "token",
            response.access_token
        );

        localStorage.setItem(
            "user",
            JSON.stringify(response.user)
        );

        setUser(response.user);

    };

    const logoutUser = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        setUser(null);

    };

    return (

        <AuthContext.Provider

            value={{

                user,

                loginUser,

                logoutUser

            }}

        >

            {children}

        </AuthContext.Provider>

    );

}

export function useAuth() {

    return useContext(AuthContext);

}