import Socket from "./websocket/index.js";
import Call from "./models/Call.js";
import Audio from "./models/AudioClass";
import Device from "./models/Device.js";
import Microphone from "./models/Microphone.js";

class WAVoip {
  constructor() {
    this.Recorder = Recorder;
  }

  connect = (device_token) => {
    const SocketInstance = new Socket(device_token);
    const AudioInstance = new Audio(SocketInstance);
    const CallModel = new Call(SocketInstance.socket);
    const DeviceModel = new Device(SocketInstance.socket);

    let currentCallState = null;

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
      AudioInstance.start(sampleRate, room);

      Microphone.init(SocketInstance, sampleRate);
      Microphone.start();
    });
    
    SocketInstance.socket.on("audio_transport:terminate", ({ room }) => {
      AudioInstance.stop();
      Microphone.stop();
    });

    return {
      Recorder: Recorder,
      socket: SocketInstance.socket,
      getCurrentDeviceStatus: function() {
        return DeviceModel.getCurrentDeviceStatus()
      },
      getCurrentQRCode: function() {
        return DeviceModel.getCurrentQRCode()
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

export default WAVoip;