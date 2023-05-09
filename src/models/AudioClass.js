
class Audio {
  audiobuffer = [];
  isRunning = false;
  channels = 2;
  subcounter = 0;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  constructor(Socket) {
    this.Socket = Socket;
    this.audiobuffer = [];
    this.isRunning = false;

    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.channels = 2;
    this.subcounter = 0;

    this.Socket.on("audio_buffer", (buffer) => {
      this.appendBuffer(buffer);
    });

    // this.Socket.on("call_ev", (data) => {
    //   if(data?.event === 16 && data?.eventData?.call_state === 6) {
    //     this.start();
    //   }
    //   else if(data?.event === 16 && data?.eventData?.call_state === 0) {
    //     this.stop();
    //   }
    // });

    this.Socket.on("call_ev", (data) => {
      if (data?.event === 16 && data?.eventData?.call_state === 0) {
        this.stop();
      }
    });
  }

  play() {
    if (!this.isRunning) {
      return;
    }

    if (this.audiobuffer.length === 0) {
      // console.error("[RSVOIP] - error empty buffer")
      setTimeout(() => {
        this.play();
      }, 1);
      return;
    }

    try {
      if (this.subcounter < this.audiobuffer.length) {
        var frameCount = this.audiobuffer[this.subcounter].length;
        var myAudioBuffer = this.audioCtx.createBuffer(this.channels, frameCount, 16000);
        for (var channel = 0; channel < this.channels; channel++) {
          var nowBuffering = myAudioBuffer.getChannelData(channel);
          for (var i = 0; i < frameCount; i++) {
            // audio needs to be in [-1.0; 1.0]
            var word = this.audiobuffer[this.subcounter][i];
            nowBuffering[i] = ((word + 32768) % 65536 - 32768) / 32768.0;
            // nowBuffering[i] = Math.sin((i%168)/168.0*Math.PI*2);
          }

          for (var i = 0; i < 100; i++) {
            nowBuffering[i] = nowBuffering[i] * i / 100;//fade in
            nowBuffering[frameCount - i - 1] = nowBuffering[frameCount - i - 1] * i / 100;//fade out
          }
        }

        if (this.subcounter < (this.audiobuffer.length - 1)) {
          this.subcounter = this.audiobuffer.length - 1;
        }
        else {
          this.subcounter += 1;
        }

        var source = this.audioCtx.createBufferSource();
        source.buffer = myAudioBuffer;
        source.connect(this.audioCtx.destination);
        // source.onended = play;
        source.start();

        this.play();
      }
      else {
        setTimeout(() => {
          this.play();
        }, 1);
      }
    }
    catch (error) {
      console.error(error);
    }
  }

  start() {
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.audiobuffer = [];
    this.subcounter = 0;
    this.isRunning = true;
    this.play();
  }

  appendBuffer(msg) {
    if (this.isRunning) {
      // console.log(this.audiobuffer.length, this.subcounter);
      this.audiobuffer.push(new Uint32Array(msg));
    }
  };

  stop() {
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.audiobuffer = [];
    this.subcounter = 0;
    this.isRunning = false;
  }
}

export default Audio;