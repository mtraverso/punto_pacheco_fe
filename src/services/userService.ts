import fetchWrapper from "../utils/Utils";
import jwtDecode from "jwt-decode";
import history from "../utils/History";

class AuthService {
    login(email: string, password: string) {
        return fetchWrapper(`${process.env.REACT_APP_API_PATH}/token/`, {
            method: 'POST',
            body: JSON.stringify({email, password})
        }).then(token => {
            console.log(token)
            localStorage.setItem('user', JSON.stringify(token))
            history.push("/dashboard")
            //@ts-ignore
            return {user:jwtDecode(token.access), token:token.access}
        })
    }

    logout() {
        return Promise.resolve().then(() => {
            localStorage.removeItem("user");
        }).then(() => {
            history.push('/logout')
        });
    }

    getCurrentUser() {
        const userStr = localStorage.getItem("user");
        //@ts-ignore
        if (userStr) {
            try {
                let access_decoded = jwtDecode(JSON.parse(userStr).access);
                console.log(access_decoded)
                return access_decoded;
            } catch (e) {
                return null
            }
        }
        return null;
    }

    getToken() {
        const userStr = localStorage.getItem("user");
        //@ts-ignore
        if (userStr) {
            return JSON.parse(userStr).access
        }
        return null;
    }
}

export default new AuthService();