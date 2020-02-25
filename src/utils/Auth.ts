import axios, { AxiosResponse } from 'axios';

export interface AuthData {
    email: string;
    password: string;
}

export const Authenticate = async (url: string, data: AuthData): Promise<string> => {
    const repsonse: AxiosResponse = await axios.post(url, data);
    return repsonse.data.token;
};

export const Header = (token: string) => {
    return { polling: { extraHeaders: { authorization: `Bearer ${token}` } } };
    // return { authorization: `Bearer ${token}` };
};