import easymidi from "easymidi";
import osc from "osc";

import Executor from "./executor.js";
import { sleep } from "../lib/func.js";

export default class ApcMini {
  midiDeviceNameIn;
  midiDeviceNameOut;
  localIp;
  localPort;
  remoteIp;
  remotePort;

  brightnessLevel = 6;

  executor = new Executor();

  midiInput;
  midiOutput;

  currentPage = 1;

  commands = {
    one: "Page 1", //clip stop
    two: "Page 2", //solo
    three: "Page 3", //mute
    four: "Page 4", //rec arm
    five: "Page 5", //select
    six: "Page 6", //drum
    seven: "Page 7", //note
    eight: "Page 8", //stop all clips
  };

  constructor(midiDeviceNameIn, midiDeviceNameOut, localIp, localPort, remoteIp, remotePort) {
    this.midiDeviceNameIn = midiDeviceNameIn;
    this.midiDeviceNameOut = midiDeviceNameOut;
    this.localIp = localIp;
    this.localPort = localPort;
    this.remoteIp = remoteIp;
    this.remotePort = remotePort;
    this.setupMidi();
    this.sanityTest();
    this.createUdp();
  }

  setupExecutor(colorEmpty, colorOff, colorOn, fx) {
    this.executor.colorEmpty = colorEmpty;
    this.executor.colorOff = colorOff;
    this.executor.colorOn = colorOn;
    this.executor.fx = fx;
  }

  setupMidi() {
    console.debug(`MIDI inputs: ${easymidi.getInputs()}`);
    console.debug(`MIDI outputs: ${easymidi.getOutputs()}`);

    console.debug(`Setting up MIDI devices: '${this.midiDeviceNameIn}' and '${this.midiDeviceNameOut}'`);
    this.midiInput = new easymidi.Input(this.midiDeviceNameIn);
    this.midiOutput = new easymidi.Output(this.midiDeviceNameOut);
  }

  sendMidiMessage(message) {
    this.midiOutput.send("noteon", message);
  }

  clear() {
    for (var i = 0; i < 128; i++) {
      this.sendMidiMessage({ note: i, velocity: 0, channel: 0 });
    }
    return;
  }

  setPageLight(page) {
    this.sendMidiMessage({ note: page + 111, velocity: 1, channel: 0 });
    this.currentPage = page;
    return;
  }

  async sanityTest() {
    this.clear();

    this.setPageLight(this.currentPage);

    this.sendMidiMessage({ note: 27, velocity: 5, channel: 7 });
    this.sendMidiMessage({ note: 28, velocity: 9, channel: 8 });
    this.sendMidiMessage({ note: 36, velocity: 13, channel: 9 });
    this.sendMidiMessage({ note: 43, velocity: 17, channel: 10 });
    this.sendMidiMessage({ note: 44, velocity: 25, channel: 11 });
    this.sendMidiMessage({ note: 52, velocity: 41, channel: 12 });
    this.sendMidiMessage({ note: 59, velocity: 45, channel: 13 });
    this.sendMidiMessage({ note: 60, velocity: 49, channel: 14 });

    for (let x = 0; x < 16; x++) {
      this.sendMidiMessage({ note: x, velocity: 3, channel: x });
      await sleep(100);
    }
  }

  createUdp() {
    console.debug("Creating UDP port");

    const udpPort = new osc.UDPPort({
      localAddress: this.localIp,
      localPort: this.localPort,
      remoteAddress: this.remoteIp,
      remotePort: this.remotePort,
    });

    udpPort.open();

    console.debug("UDP port opened");

    return udpPort;
  }
}
