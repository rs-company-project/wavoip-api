class Microphone {
  mediaRecorder = null;
  initied = false;
  isRunning = false;

  constructor(Socket) {
    this.Socket = Socket;
    this.mediaRecorder = null;
    this.isRunning = false;
    this.initied = false;

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
    })
  }

  async init() {
    if (navigator.mediaDevices) {
      const constraints = {
        audio: true
      };

      this.mediaRecorder = await navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          if (this.initied) {
            return;
          }

          var context;
          if (window.AudioContext) {
            context = new AudioContext({
              sampleRate: 16000
            });
          } else {
            context = new webkitAudioContext({
              sampleRate: 16000
            });
          }

          var mediastream = context.createMediaStreamSource(stream);
          var bufferSize = 0;
          var myscriptnode = context.createScriptProcessor(bufferSize, 1, 1);

          if (myscriptnode) {
            this.initied = true;
          }

          myscriptnode.onaudioprocess = (AudioBuffer) => {
            if (!this.isRunning) {
              return;
            }

            var left = AudioBuffer.inputBuffer.getChannelData(0);

            var l = left.length;
            var buf = new Int16Array(l);

            while (l--) {
              buf[l] = left[l] * 0xFFFF;    //convert to 16 bit
            }

            // console.log(buf.buffer, "buf.buffer");
            this.Socket.emit("microphone_buffer", buf.buffer);
          };

          mediastream.connect(myscriptnode);
          myscriptnode.connect(context.destination);

          console.log(myscriptnode, "myscriptnode")
          // let mediaRecorder = new MediaRecorder(stream);

          // mediaRecorder.ondataavailable = (e) => {
          //   console.log(e.data);
          //   console.log(e);
          //   this.Socket.emit("microphone_buffer", e.data);
          // };

          // mediaRecorder.onstop = (e) => {
          //   // Mic is stoped
          //   // console.log("stoped micro");
          // };

          // return mediaRecorder;
          return context;
        })
        .catch((error) => {
          console.error(`[MICROPHONE-STREAM] - error when get usermedia | ${error?.toString()} ${JSON.stringify(error)}`);
          return error;
        });
    }
    else {
      console.error(`[MICROPHONE-STREAM] - error getUserMedia unsupported.`, navigator.mediaDevices);
    }
  }

  async start() {
    try {
      if (!this.initied) {
        await this.init();
        this.start();

        return;
      }


      this.isRunning = true;
    }
    catch (error) {
      console.error(`[MICROPHONE-STREAM] - error when start stream. | ${error?.toString()} ${JSON.stringify(error)}`);

      return {
        type: "error",
        result: error
      };
    }
  }

  stop() {
    try {
      if (navigator.mediaDevices) {
        if (!this.mediaRecorder) {
          this.init();
        }

        this.isRunning = false;
      }
      else {
        return {
          type: "error",
          result: "Media device is not loaded"
        }
      }
    } catch (error) {
      console.error(`[MICROPHONE-STREAM] - error when stop stream. | ${error?.toString()} ${JSON.stringify(error)}`);

      return {
        type: "error",
        result: error
      };
    }
  }
}

export default Microphone;