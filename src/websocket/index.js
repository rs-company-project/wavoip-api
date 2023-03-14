import { io } from "socket.io-client";

import { baseURL } from "../config";
// import Audio from "../models/Audio.js";

// import Logs from "../functions/Logs.js";

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
      path: `/${this.device_token}/core`
    });
  }

  // registerEvents() {
  //   this.socket_audio.on("audio_buffer", (buffer) => {
  //     Audio.appendBuffer(buffer);
  //   });
  // }
}

export default Socket;