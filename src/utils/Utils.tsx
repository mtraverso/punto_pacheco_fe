import userService from "../services/userService";
import {NavigateFunction} from "react-router-dom";

interface FetchWrapperOptions {
    method?: string;
    body?: BodyInit;
}

export const fetchWrapper = async (
    url: string,
    options?: FetchWrapperOptions,
): Promise<Response> => {
    const userStr = localStorage.getItem("user");
    let user = null;
    if (userStr)
        user = JSON.parse(userStr);

    const requestHeaders: HeadersInit = new Headers();
    requestHeaders.set('Content-Type', 'application/json');
    if (user) {
        requestHeaders.set('Authorization', `Bearer ${user.access}`);
    }
    requestHeaders.set('Accept', 'application/json');
    try {
        const response = await fetch(url, {
                ...options,
                headers: requestHeaders,
            },
        );

        if (response.status === 401) {
            // Handle unauthorized error
            //Try to refresh token
            const refreshResponse:any = await fetchWrapper(`${process.env.REACT_APP_API_PATH}/token/refresh/`, {
                method: 'POST',
                body: JSON.stringify({refresh: user.refresh})
            })
            if (refreshResponse.access) {
                user.access = refreshResponse.access;
                localStorage.setItem('user', JSON.stringify(user));
                return await fetchWrapper(url, options);
            }

            throw new Error("401");
        }
        if (response.status === 204) {
            return new Response(null, {status: 204, statusText: 'No content'})
        }

        return response.json();
    } catch (error) {
        // Handle network errors or other exceptions
        console.error(error);
        throw error;
    }
};


export default fetchWrapper;

export const checkLoggedIn = (navigate:NavigateFunction) => {
    if (!userService.getCurrentUser()) {
        navigate('/')
        return
    }
}