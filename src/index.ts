import { Authenticate, AuthData, Header } from './utils/Auth';
import {v4 as uuid} from 'uuid';
import io from 'socket.io-client';

interface CustomerData {
    name: string;
    email: string;
    info: any;
}

const CustomerConnection = (url: string, customer: CustomerData) => {
    const connection = io(url, { query: { id: uuid(), ...customer } });

    return {
        sendMessage: (msg: string) => {
            connection.emit(customer.email, {command: 'send', data: msg});
        },

        messages: (callback: (message: { from: string; iat: string; message: string; }) => void) => {
            connection.on('message', callback);
        },
    };
};

const UserConnection = async (url: string, data: AuthData) => {
    const token: string = await Authenticate(`${url}/signin`, data);
    const connection = io(url, {transportOptions: Header(token)});

    return {
        startAttendende: () => {
            connection.emit(data.email, {command: 'get:attendence', data: null});
        },

        sendMessage: (msg: string) => {
            connection.emit(data.email, {command: 'send', data: msg});
        },

        messages: (callback: (message: { from: string; iat: string; message: string; }) => void) => {
            connection.on('message', callback);
        },
    };
};

export default { CustomerConnection, UserConnection };