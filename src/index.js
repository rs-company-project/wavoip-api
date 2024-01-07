import Socket from "./websocket/index.js";
import Call from "./models/Call.js";
import Microphone from "./models/MicrophoneClass.js";
import Audio from "./models/AudioClass";
import Device from "./models/Device.js";

class RSVoip {
  constructor() {

  }

  connect = (device_token) => {
    const SocketInstance = new Socket(device_token);
    const MicrophoneInstance = new Microphone(SocketInstance.socket);
    const AudioInstance = new Audio(SocketInstance.socket);
    const CallModel = new Call(SocketInstance.socket, MicrophoneInstance, AudioInstance);
    const DeviceModel = new Device(SocketInstance.socket);

    let currentCallState = null;
    SocketInstance.socket.on('connect', () => {
      console.log('Successfully connected!');

      if(currentCallState === "accept") {
        AudioInstance.start();
        MicrophoneInstance.start();
      }
    });

    SocketInstance. socket.on("disconnect", (reason) => {
      AudioInstance.stop();
      MicrophoneInstance.stop();
    });

   

    SocketInstance.socket.on('signaling', (data) => {
      if(data.tag) {
        currentCallState = data.tag;
      }
      currentCallState = data.tag;

      if(data.tag === "accept") {
        AudioInstance.start();
        MicrophoneInstance.start();
      }

      if(data.tag === "terminate") {
        AudioInstance.stop();
        MicrophoneInstance.stop();
      }
    });
    

    // SocketInstance.socket.io.on("error", (error) => {
    //   console.log('Error connected!', error);
    // });

    // SocketInstance.socket.io.on("reconnect", (attempt) => {
    //   console.log('Error reconnect_attempt!', attempt);
    // });

    // SocketInstance.socket.io.on("reconnect_attempt", (attempt) => {
    //   console.log('Error reconnect_attempt!', attempt);
    // });

    // SocketInstance.socket.io.on("reconnect_error", (error) => {
    //   console.log('Error reconnect_attempt!', error);
    // });

    // SocketInstance.socket.io.on("reconnect_failed", (attempt) => {
    //   console.log('Error reconnect_attempt!', attempt);
    // });

    return {
      socket: SocketInstance.socket,
      getCurrentDeviceStatus: function() {
        return DeviceModel.getCurrentDeviceStatus()
      },
      getCurrentQRCode: function() {
        return DeviceModel.getCurrentQRCode()
      },
      audioStart: function() {
        AudioInstance.start();
      },
      microphoneStart: function() {
        MicrophoneInstance.start();
      },
      callStart: function(params) {
        CallModel.callStart(params);
      },
      endCall: () => {
        CallModel.endCall();
      },
      acceptCall: () => {
        CallModel.acceptCall();
      },
      rejectCall: () => {
        CallModel.rejectCall();
      },
      mute: () => {
        CallModel.mute();
      },
      unMute: () => {
        CallModel.unMute();
      },
    }
  }
}

export default RSVoip;