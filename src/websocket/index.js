import { io } from "socket.io-client";

import { baseURL } from "../config";

class Socket {
  constructor(device_token) {
    this.device_token = device_token;
    this.socket = null;

    this.start();
  }

  start() {
    this.socket = io(baseURL, {
      // transports: ['websocket'],
      // withCredentials: true,
      path: `/${this.device_token}`
    });
  }
}

export default Socket;