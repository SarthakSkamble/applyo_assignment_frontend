import { io } from "socket.io-client";

const socket = io("https://applyo-assignment-backend.onrender.com");

export default socket;