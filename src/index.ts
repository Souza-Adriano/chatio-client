import {v4 as uuid} from 'uuid';
import io from 'socket.io-client';
import axios from 'axios';

interface UserConnection {
    attendence: () => void;
    message: {
        send: (message: string) => void;
        listen: (callback: (message: { from: string; iat: string; message: string; }) => void) => void;
    };
}

interface CustomerConnection {
    message: {
        send: (message: string) => void;
        listen: (callback: (message: { from: string; iat: string; message: string; }) => void) => void;
    };
}

const Chatio = (url: string) => {
    return {
        User: async (email: string, password: string): Promise<UserConnection> => {
            const token = await axios.post(`${url}/signin`, { email, password });
            const socket = io(url, {
                query: {authorization: `Bearer ${token}`},
                forceNew: true,
                transports: ['websocket'],
            });
            return {
                attendence: () => {
                    socket.emit(email, { command: 'get:attendence', data: null });
                },
                message: {
                    listen: (callback: (message: { from: string; iat: string; message: string; }) => void) => {
                        socket.on('message', callback);
                    },
                    send: (message: string) => {
                        socket.emit(email, { command: 'send', data: message });
                    },
                },
            };
        },
        Customer: async (name: string, email: string, info: any): Promise<CustomerConnection> => {
            const socket = io(url, {
                query: { id: uuid(), name, email, info },
                forceNew: true,
                transports: ['websocket'],
            });
            return {
                message: {
                    listen: (callback: (message: { from: string; iat: string; message: string; }) => void) => {
                        socket.on('message', callback);
                    },
                    send: (message: string) => {
                        socket.emit(email, { command: 'send', data: message });
                    },
                },
            };
        },
    };
};

export default Chatio;