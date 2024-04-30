import Socket from "./websocket/index.js";
import Call from "./models/Call.js";
import Audio from "./models/AudioClass.js";
import Device from "./models/Device.js";
import Microphone from "./models/Microphone.js";

class WAVoip {
  constructor() {
  }

  connect = (device_token) => {
    const SocketInstance = new Socket(device_token);
    const AudioInstance = new Audio(SocketInstance);
    const CallModel = new Call(SocketInstance.socket);
    const DeviceModel = new Device(SocketInstance.socket);

    let currentCallState;
    
    SocketInstance.socket.on('connect', () => {
      console.log('Successfully connected!');
    });

    SocketInstance.socket.on("disconnect", (reason) => {
    });

    SocketInstance.socket.on('signaling', (data) => {
      if(data.tag) {
        currentCallState = data.tag;
      }
      currentCallState = data.tag;
    });

    SocketInstance.socket.on("audio_transport:create", ({ room, sampleRate }) => {
      AudioInstance.start(16000, room);

      Microphone.init(SocketInstance, 16000);
      Microphone.start();
    });
    
    SocketInstance.socket.on("audio_transport:terminate", ({ room }) => {
      AudioInstance.stop();
      Microphone.stop();
    });

    return {
      socket: SocketInstance.socket,
      getCurrentDeviceStatus: function() {
        return DeviceModel.getCurrentDeviceStatus()
      },
      getCurrentQRCode: function() {
        return DeviceModel.getCurrentQRCode()
      },
      callStart: function(params) {
        return CallModel.callStart(params);
      },
      endCall: () => {
        return CallModel.endCall();
      },
      acceptCall: () => {
        return CallModel.acceptCall();
      },
      rejectCall: () => {
        return CallModel.rejectCall();
      },
      mute: () => {
        return CallModel.mute();
      },
      unMute: () => {
        return CallModel.unMute();
      },
    }
  }
}

export default WAVoip;