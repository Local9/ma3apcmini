import easymidi from "easymidi";
import osc from "osc";

import Executor from "./executor.js";
import { sleep, getClosestVelocityForColor } from "../lib/func.js";
import Logger from "../lib/logger.js";
import KeyEnum from "../lib/keyEnum.js";

export default class ApcMini {
  midiDeviceNameIn;
  midiDeviceNameOut;
  localIp;
  localPort;
  remoteIp;
  remotePort;
  colorEnabled = false;

  brightnessLevel = 6;

  executor = new Executor();

  midiInput;
  midiOutput;

  currentPage = 1;
  isBlackOut = false;
  isCleared = false;

  faderArray = [0, 0, 0, 0, 0, 0, 0, 0];
  grandMaster = 100;

  softKeys = {
    112: "Page 1", //clip stop
    113: "Page 2", //solo
    114: "Page 3", //mute
    115: "Page 4", //rec arm
    116: "Page 5", //select
    117: "Page 6", //drum
    118: "Page 7", //note
    119: "Page 8", //stop all clips
  };

  blackoutKey = 122; //shift
  softKeysList = Object.keys(this.softKeys).map(Number);
  softKeysShift = 111;

  buttonRows = {
    0: { shift: 101, buttons: [0, 1, 2, 3, 4, 5, 6, 7] },
    1: { shift: 193, buttons: [8, 9, 10, 11, 12, 13, 14, 15] },
    2: { shift: 0, buttons: [16, 17, 18, 19, 20, 21, 22, 23] }, // we leave this row alone
    3: { shift: 92, buttons: [24, 25, 26, 27, 28, 29, 30, 31] },
    4: { shift: 99, buttons: [32, 33, 34, 35, 36, 37, 38, 39] },
    5: { shift: 106, buttons: [40, 41, 42, 43, 44, 45, 46, 47] },
    6: { shift: 113, buttons: [48, 49, 50, 51, 52, 53, 54, 55] },
    7: { shift: 120, buttons: [56, 57, 58, 59, 60, 61, 62, 63] },
  };

  buttonRowFaders = { shift: 101, buttons: [100, 101, 102, 103, 104, 105, 106, 107] };

  constructor(midiDeviceNameIn, midiDeviceNameOut, localIp, localPort, remoteIp, remotePort, colorEnabled) {
    this.midiDeviceNameIn = midiDeviceNameIn;
    this.midiDeviceNameOut = midiDeviceNameOut;
    this.localIp = localIp;
    this.localPort = localPort;
    this.remoteIp = remoteIp;
    this.remotePort = remotePort;
    this.colorEnabled = colorEnabled;
    this.setupMidi();
    this.sanityTest();
    this.createUdp();

    Logger.success("APC Mini initialized");
    Logger.debug(`Local IP: ${this.localIp}`);
    Logger.debug(`Local Port: ${this.localPort}`);
    Logger.debug(`Remote IP: ${this.remoteIp}`);
    Logger.debug(`Remote Port: ${this.remotePort}`);
    Logger.debug(`Color enabled: ${this.colorEnabled}`);
    Logger.debug(`Page buttons: ${this.softKeysList}`);
  }

  setupExecutor(colorEmpty, colorOff, colorOn, fx) {
    this.executor.colorEmpty = colorEmpty;
    this.executor.colorOff = colorOff;
    this.executor.colorOn = colorOn;
    this.executor.fx = fx;
  }

  setupMidi() {
    Logger.debug(`MIDI inputs: ${easymidi.getInputs()}`);
    Logger.debug(`MIDI outputs: ${easymidi.getOutputs()}`);

    Logger.debug(`Setting up MIDI devices: '${this.midiDeviceNameIn}' and '${this.midiDeviceNameOut}'`);
    this.midiInput = new easymidi.Input(this.midiDeviceNameIn);
    this.midiOutput = new easymidi.Output(this.midiDeviceNameOut);

    this.midiInput.on("noteon", (message) => {
      this.handleNoteOn(message);
    });

    this.midiInput.on("noteoff", (message) => {
      this.handleNoteOff(message);
    });

    this.midiInput.on("cc", (message) => {
      this.handleContinuousController(message);
    });
  }

  sendMidiOnMessage(message) {
    Logger.debug(`Sending MIDI on message: ${JSON.stringify(message)}`);
    this.midiOutput.send("noteon", message);
  }

  clear() {
    for (var i = 0; i < 128; i++) {
      this.sendMidiOnMessage({ note: i, velocity: 0, channel: 0 });
    }
  }

  setPageLight(page) {
    if (this.currentPage) {
      this.sendMidiOnMessage({ note: this.currentPage + this.softKeysShift, velocity: 0, channel: 0 });
    }
    this.sendMidiOnMessage({ note: page + this.softKeysShift, velocity: 1, channel: 0 });
    this.currentPage = page;
  }

  setPageLightByNote(note) {
    Logger.debug(`Setting page light by note: ${note}`);
    this.sendMidiOnMessage({ note: this.currentPage + this.softKeysShift, velocity: 0, channel: 0 });
    this.sendMidiOnMessage({ note: note, velocity: 1, channel: 0 });
    this.currentPage = note - this.softKeysShift;
  }

  setLightFader(note, velocity) {
    this.sendMidiOnMessage({ note: note, velocity: velocity, channel: this.brightnessLevel });
  }

  async sanityTest() {
    this.clear();

    this.setPageLight(this.currentPage);

    this.sendMidiOnMessage({ note: 27, velocity: 5, channel: 7 });
    this.sendMidiOnMessage({ note: 28, velocity: 9, channel: 8 });
    this.sendMidiOnMessage({ note: 36, velocity: 13, channel: 9 });
    this.sendMidiOnMessage({ note: 43, velocity: 17, channel: 10 });
    this.sendMidiOnMessage({ note: 44, velocity: 25, channel: 11 });
    this.sendMidiOnMessage({ note: 52, velocity: 41, channel: 12 });
    this.sendMidiOnMessage({ note: 59, velocity: 45, channel: 13 });
    this.sendMidiOnMessage({ note: 60, velocity: 49, channel: 14 });

    for (let x = 0; x < 16; x++) {
      this.sendMidiOnMessage({ note: x, velocity: 3, channel: x });
      await sleep(100);
    }
  }

  createUdp() {
    Logger.debug("Creating UDP port");

    const udpPort = new osc.UDPPort({
      localAddress: this.localIp,
      localPort: this.localPort,
      metadata: true,
    });

    udpPort.open();

    Logger.debug("UDP port opened");

    udpPort.on("ready", () => {
      Logger.debug("UDP port ready");
      Logger.success(`Please start the OSC plugin in grandMA3 onPC, to receive LED feedback.`);
    });

    udpPort.on("error", (error) => {
      Logger.error(`An error occurred: ${error.message}`);
    });

    udpPort.on("message", (message) => {
      this.handleUdpMessage(message);
    });

    return udpPort;
  }

  sendUdpCommand(args) {
    Logger.debug(`Sending UDP command: ${args}`);
    this.udpPort.send({ address: "/cmd", args }, this.remoteIp, this.remotePort);
  }

  sendUdpFaderCommand(controller, value) {
    Logger.debug(`Sending UDP fader command: ${controller} - ${value}`);
    this.udpPort.send({ address: `/Fader${controller}`, args: [{ type: "i", value: value }] }, this.remoteIp, this.remotePort);
  }

  sendUdpKeyCommand(note, value) {
    Logger.debug(`Sending UDP key command: ${note} - ${value}`);
    this.udpPort.send({ address: `/Key${note}`, args: [{ type: "i", value: value }] }, this.remoteIp, this.remotePort);
  }

  getVelocity(status) {
    if (!(status in { 1: 1, 0: 1 })) {
      return this.executor.colorEmpty;
    }
    return status === 1 ? this.executor.colorOn : this.executor.colorOff;
  }

  updateLed(note, status, color) {
    Logger.debug(`Updating LED: ${note} - ${status} - ${color}`);

    let channelBrightness = this.brightnessLevel;
    let velocity = 0;

    if (this.colorEnabled) {
      if (color === "#000000") {
        velocity = this.getVelocity(status);
      } else {
        if (status === 1) {
          channelBrightness = this.executor.fx;
        }
        velocity = getClosestVelocityForColor(color);
      }
    } else {
      velocity = getVelocity(status);
    }

    this.sendMidiOnMessage({ note, velocity, channel: channelBrightness });
  }

  handleUdpMessage(message) {
    Logger.debug(`Handling UDP message: ${JSON.stringify(message)}`);

    if (!this.clear) {
      this.clear();
      this.clear = true;
    }

    const isPageMessage = message.address === "/Page";

    if (isPageMessage) {
      this.setPageLightByNote(message.args[0].value);
      return;
    }

    let note = KeyEnum[message.address];
    let status = message.args[0].value;
    let color = message.args[1].value;

    this.updateLed(note, status, color);
  }

  handleNoteOn(message) {
    Logger.debug(`Handling Note On: ${JSON.stringify(message)}`);

    const note = message.note;
    const velocity = message.velocity;
    // using the commands get the note number to check if its a page button
    if (this.softKeysList.includes(note)) {
      this.setPageLight(note);
      // this.sendUdpCommand([{ type: "s", value: this.commands[note].maPage }]);
      return;
    }

    if (this.buttonRows[0].buttons.includes(note)) {
      // bottom row
      this.sendUdpKeyCommand(note + this.buttonRows[0].shift, 1);
    } else if (this.buttonRows[1].buttons.includes(note)) {
      // second row
      this.sendUdpKeyCommand(note + this.buttonRows[1].shift, 1);
    } else if (this.buttonRows[2].buttons.includes(note)) {
      // third row DO NOTHING
    } else if (this.buttonRows[3].buttons.includes(note)) {
      // fourth row
      this.sendUdpKeyCommand(note + this.buttonRows[3].shift, 1);
    } else if (this.buttonRows[4].buttons.includes(note)) {
      // fifth row
      this.sendUdpKeyCommand(note + this.buttonRows[4].shift, 1);
    } else if (this.buttonRows[5].buttons.includes(note)) {
      // sixth row
      this.sendUdpKeyCommand(note + this.buttonRows[5].shift, 1);
    } else if (this.buttonRows[6].buttons.includes(note)) {
      // seventh row
      this.sendUdpKeyCommand(note + this.buttonRows[6].shift, 1);
    } else if (this.buttonRows[7].buttons.includes(note)) {
      // eighth row
      this.sendUdpKeyCommand(note + this.buttonRows[7].shift, 1);
    } else if (this.buttonRowFaders.buttons.includes(note)) {
      // faders
      this.sendMidiOnMessage({ note, velocity, channel: 0 });
      this.sendUdpFaderCommand(note + this.buttonRowFaders.shift, 127);
    } else if (this.blackoutKey === note) {
      // blackout key
      this.isBlackOut = true;
      this.sendUdpCommand([{ type: "s", value: "Master 2.1 At 0" }]);
    }
  }

  handleNoteOff(message) {
    const note = message.note;
    if (this.buttonRows[0].includes(note)) {
      // bottom row
      this.sendUdpKeyCommand(note + this.buttonRows[0].shift, 0);
    } else if (this.buttonRows[1].buttons.includes(note)) {
      // second row
      this.sendUdpKeyCommand(note + this.buttonRows[1].shift, 0);
    } else if (this.buttonRows[2].buttons.includes(note)) {
      // third row DO NOTHING
    } else if (this.buttonRows[3].buttons.includes(note)) {
      // fourth row
      this.sendUdpKeyCommand(note + this.buttonRows[3].shift, 0);
    } else if (this.buttonRows[4].buttons.includes(note)) {
      // fifth row
      this.sendUdpKeyCommand(note + this.buttonRows[4].shift, 0);
    } else if (this.buttonRows[5].buttons.includes(note)) {
      // sixth row
      this.sendUdpKeyCommand(note + this.buttonRows[5].shift, 0);
    } else if (this.buttonRows[6].buttons.includes(note)) {
      // seventh row
      this.sendUdpKeyCommand(note + this.buttonRows[6].shift, 0);
    } else if (this.buttonRows[7].buttons.includes(note)) {
      // eighth row
      this.sendUdpKeyCommand(note + this.buttonRows[7].shift, 0);
    } else if (this.buttonRowFaders.buttons.includes(note)) {
      this.sendMidiOnMessage({ note, velocity, channel: 0 });
      this.sendUdpFaderCommand(note + this.buttonRowFaders.shift, faderArray[msg.note - 100]);
    } else if (this.blackoutKey === note) {
      // blackout key
      this.isBlackOut = false;
    }
  }

  handleContinuousController(message) {
    const controller = message.controller;
    const controllerValue = message.value;

    if (controller >= 48 && controller <= 55) {
      this.faderArray[controller - 48] = controllerValue;
      this.sendUdpFaderCommand(controller, controllerValue);
    } else if (controller === 56) {
      this.grandMaster = controllerValue * 0.8;

      if (!this.isBlackOut) {
        this.sendUdpCommand([{ type: "s", value: `Master 2.1 At ${this.grandMaster}` }]);
      }
    }
  }
}
