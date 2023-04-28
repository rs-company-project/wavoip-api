import { checkReponseResult } from "../utils/functions.js";

class Call {
  constructor(Socket, Microphone, Audio) {
    this.Socket = Socket;
    this.Microphone = Microphone;
    this.Audio = Audio;
  }

  callStart({ whatsappid }) {
    return new Promise((resolve, reject) => {
      try {
        this.Socket.emit("calls:start", whatsappid, (response) => {
          try {
            if (checkReponseResult(response)) {
              resolve(response);
            }
            else {
              resolve(response);
            }
          }
          catch (error) {
            reject(error);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // callStart(whatsappid, hasVideo) {
  //   return new Promise((resolve, reject) => {
  //     // Audio.start();
  //     // Microphone.start();
  //   });
  // }

  // groupCallStart() {
  //   return new Promise((resolve, reject) => {

  //   });
  // }

  // sendGroupCallInvite() {
  //   return new Promise((resolve, reject) => {

  //   });
  // }

  endCall() {
    this.Microphone.stop();

    return new Promise((resolve, reject) => {
      this.Socket.emit("calls:end", {}, (response) => {
        if (checkReponseResult(response)) {
          resolve(response);
        }
        else {
          reject(response);
        }
      });
    });
  }

  acceptCall() {
    return new Promise((resolve, reject) => {
      this.Socket.emit("calls:accept", {}, (response) => {
        if (checkReponseResult(response)) {
          resolve(response);
        }
        else {
          reject(response);
        }
      });
    });
  }

  rejectCall() {
    return new Promise((resolve, reject) => {
      this.Socket.emit("calls:reject", {}, (response) => {
        if (checkReponseResult(response)) {
          resolve(response);
        }
        else {
          reject(response);
        }
      });
    });
  }

  mute() {
    return new Promise((resolve, reject) => {
      this.Socket.emit("calls:mute", {}, (response) => {
        if (checkReponseResult(response)) {
          resolve(response);
        }
        else {
          reject(response);
        }
      });
    });
  }

  unMute() {
    return new Promise((resolve, reject) => {
      this.Socket.emit("calls:unmute", {}, (response) => {
        if (checkReponseResult(response)) {
          resolve(response);
        }
        else {
          reject(response);
        }
      });
    });
  }

  // videoTurnCameraOn() {
  //   return new Promise((resolve, reject) => {

  //   });
  // }

  // videoTurnCameraOff() {
  //   return new Promise((resolve, reject) => {

  //   });
  // }

  // videoStreamPause() {
  //   return new Promise((resolve, reject) => {

  //   });
  // }

  // videoStreamResume() {
  //   return new Promise((resolve, reject) => {

  //   });
  // }

  // updateAudioVideoSwitch() {
  //   return new Promise((resolve, reject) => {

  //   });
  // }

  // videoRequestUpgrade() {
  //   return new Promise((resolve, reject) => {

  //   });
  // }

  // videoAcceptUpgrade() {
  //   return new Promise((resolve, reject) => {

  //   });
  // }

  // videoRejectUpgrade() {
  //   return new Promise((resolve, reject) => {

  //   });
  // }

  // videoCancelUpgrade() {
  //   return new Promise((resolve, reject) => {

  //   });
  // }
}

export default Call;