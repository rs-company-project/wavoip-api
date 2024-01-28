import PCMPlayer from "./PCMPlayer.js";

class Audio {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  
  constructor(Socket) {
    this.Socket = Socket;
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.player;
  }

  start(sampleRate) {
    this.player = new PCMPlayer({
      encoding: '16bitInt',
      channels: 1,
      sampleRate: sampleRate,
      flushingTime: 5000
    });

    this.Socket.socket_audio_transport.on("audio_buffer", (buffer) => {
      let raw = new Uint8Array(buffer);			
      this.player.feed(raw);
    });
  }

  stop() {
    console.info("[*] - Audio stream stopped");
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.player.destroy(raw);

    this.Socket?.socket_audio_transport?.off("audio_buffer");
  }
}

export default Audio;