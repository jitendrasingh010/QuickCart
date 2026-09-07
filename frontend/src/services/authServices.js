import api from '../lib/axios';

export const signup = async (userData) => {
    const response = await api.post("/userapi/signup", userData);
    return response.data;
};

export const login = async (userData) => {
    const response = await api.post("/userapi/login", userData);
    return response.data;
};

export const logout = async () => {
    const response = await api.post("/userapi/logout");
    return response.data;
};

export const googleLogin = async (token) => {
    const response = await api.post("/userapi/google-login", { token });
    return response.data;
};



