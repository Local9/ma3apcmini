import { Channels } from "./enums/channels";
import { Colors } from "./enums/colors";
import { FaderKeys } from "./enums/faderKeys";
import { SoftKeys } from "./enums/softkeys";
import { sleep, getClosestVelocityForColor } from "./lib/func";
import Logger from "./lib/logger";
import { WebMidi } from "webmidi";
import OSC from "osc-js";
import { Keys } from "./enums/keys";

const BUTTON_ROWS = {
  0: { shift: 101, buttons: [0, 1, 2, 3, 4, 5, 6, 7] },
  1: { shift: 193, buttons: [8, 9, 10, 11, 12, 13, 14, 15] },
  2: { shift: 0, buttons: [16, 17, 18, 19, 20, 21, 22, 23] }, // we leave this row alone
  3: { shift: 92, buttons: [24, 25, 26, 27, 28, 29, 30, 31] },
  4: { shift: 99, buttons: [32, 33, 34, 35, 36, 37, 38, 39] },
  5: { shift: 106, buttons: [40, 41, 42, 43, 44, 45, 46, 47] },
  6: { shift: 113, buttons: [48, 49, 50, 51, 52, 53, 54, 55] },
  7: { shift: 120, buttons: [56, 57, 58, 59, 60, 61, 62, 63] },
};

const FADER_VALUE_ARRAY = [0, 0, 0, 0, 0, 0, 0, 0];
const FADER_CONTROLS = [48, 49, 50, 51, 52, 53, 54, 55];

const PAGE_TRACKING_SHIFT = 111;
let currentPage = 1;

const BUTTON_BLACKOUT = 122;
const FADER_GRANDMASTER = 56;
let grandMaster = 100;
let isBlackoutEnabled = false;
let isColorEnabled = true;
let isCleared = false;

const FADER_KEYS = Object.keys(FaderKeys).filter((v) => !isNaN(Number(v)));
const FADER_KEY_SHIFT = 101;

const SOFT_KEYS = Object.keys(SoftKeys).filter((v) => !isNaN(Number(v)));

// changing params
const midiDevice: string = "APC mini mk2";
const LOCAL_IP = "127.0.0.1";
const LOCAL_PORT = 8001;
const REMOTE_IP = "127.0.0.1";
const REMOTE_PORT = 8000;

WebMidi.enable()
  .then(() => {
    Logger.success("WebMidi enabled");
    Logger.debug("Available inputs:");
    WebMidi.inputs.forEach((input) => {
      Logger.debug(`- ${input.name}`);
    });
    Logger.debug("Available outputs:");
    WebMidi.outputs.forEach((output) => {
      Logger.debug(`- ${output.name}`);
    });

    if (WebMidi.enabled) {
      Logger.success("WebMidi enabled");
    } else {
      Logger.error("WebMidi not enabled");
      return;
    }

    const midiInputs = WebMidi.getInputByName(midiDevice);
    const midiOutputs = WebMidi.getOutputByName(midiDevice);

    if (!midiInputs) {
      Logger.error(`Midi input ${midiDevice} not found`);
      return;
    }

    if (!midiOutputs) {
      Logger.error(`Midi output ${midiDevice} not found`);
      return;
    }

    Logger.success(`Midi input ${midiDevice} found`);

    const inputSynth = midiInputs.channels[1];

    const sendNoteOn = (note: number, channel: number, color: Colors) => {
      midiOutputs.sendNoteOn(note, { channels: channel, rawAttack: color });
    };

    const sendNoteOff = (note: number, channel: number) => {
      midiOutputs.sendNoteOn(note, { channels: channel, rawAttack: Colors.Off });
    };

    const clearAllKeys = () => {
      for (let x = 0; x < 128; x++) {
        sendNoteOn(x, Channels.brightness10, Colors.Off);
      }
    };

    clearAllKeys();

    const changePageByNote = (note: number) => {
      // turn off the previous page
      sendNoteOff(currentPage + PAGE_TRACKING_SHIFT, 1);
      // turn on the new page
      sendNoteOn(note, 1, 1);
      // update the page
      currentPage = note - PAGE_TRACKING_SHIFT;
    };

    const changePage = (newPage: number) => {
      // turn off the previous page
      sendNoteOff(currentPage + PAGE_TRACKING_SHIFT, 1);
      // turn on the new page
      sendNoteOn(newPage + PAGE_TRACKING_SHIFT, 1, 1);
      // update the page
      currentPage = newPage;
    };

    const getVelocity = (status) => {
      if (!(status in { 1: 1, 0: 1 })) {
        return Colors.Off;
      }
      return status === 1 ? Colors.Green : Colors.Orange;
    };

    const changeLightState = (note: number, status: number, color: string) => {
      let channel = Channels.brightness100;
      let ledColor = Colors.Off;

      if (isColorEnabled) {
        if (color === "#000000") {
          ledColor = getVelocity(status);
        } else {
          if (status === 1) {
            channel = Channels.pulse1;
          }
          ledColor = getClosestVelocityForColor(color);
        }
      } else {
        ledColor = getVelocity(status);
      }

      sendNoteOn(note, channel, ledColor);
    };

    // OSC Server and Client
    const config = {
      type: "udp4",
      open: {
        host: LOCAL_IP,
        port: LOCAL_PORT,
        exclusive: false,
      },
      send: {
        host: REMOTE_IP,
        port: REMOTE_PORT,
      },
    };

    const osc = new OSC({ plugin: new OSC.DatagramPlugin(config) });
    osc.open({ host: LOCAL_IP, port: LOCAL_PORT });

    osc.on("open", () => {
      Logger.success(`OSC Server running on ${LOCAL_IP}:${LOCAL_PORT}`);
    });

    osc.on("*", (message) => {
      if (!isCleared) {
        clearAllKeys();
        isCleared = true;
      }

      const address = message.address;
      const args = message.args;

      if (address == "/Page") {
        const page = +args[0];
        changePage(page);
        return;
      }

      const note = Keys[address];
      const status = args[0];
      const color = args[1];

      changeLightState(+note, status, color);
    });

    // MIDI LISTENERS

    inputSynth.addListener("noteon", (e) => {
      const note = e.note.number;
      const channel = e.message.channel;

      // if the note is a page number, we need to change the page
      // TODO : Clean this, it's a mess
      if (SOFT_KEYS.includes(note.toString())) {
        changePageByNote(note);
        let page = "Page 1";

        switch (note) {
          case SoftKeys.Page1:
            page = "Page 1";
            break;
          case SoftKeys.Page2:
            page = "Page 2";
            break;
          case SoftKeys.Page3:
            page = "Page 3";
            break;
          case SoftKeys.Page4:
            page = "Page 4";
            break;
          case SoftKeys.Page5:
            page = "Page 5";
            break;
          case SoftKeys.Page6:
            page = "Page 6";
            break;
          case SoftKeys.Page7:
            page = "Page 7";
            break;
          case SoftKeys.Page8:
            page = "Page 8";
            break;
        }

        osc.send(new OSC.Message("/cmd", page));
        return;
      }

      if (BUTTON_ROWS[0].buttons.includes(note)) {
        osc.send(new OSC.Message(`/Key${note + BUTTON_ROWS[0].shift}`, 1));
      } else if (BUTTON_ROWS[1].buttons.includes(note)) {
        osc.send(new OSC.Message(`/Key${note + BUTTON_ROWS[1].shift}`, 1));
      } else if (BUTTON_ROWS[2].buttons.includes(note)) {
        // DO NOTHING
      } else if (BUTTON_ROWS[3].buttons.includes(note)) {
        osc.send(new OSC.Message(`/Key${note + BUTTON_ROWS[3].shift}`, 1));
      } else if (BUTTON_ROWS[4].buttons.includes(note)) {
        osc.send(new OSC.Message(`/Key${note + BUTTON_ROWS[4].shift}`, 1));
      } else if (BUTTON_ROWS[5].buttons.includes(note)) {
        osc.send(new OSC.Message(`/Key${note + BUTTON_ROWS[5].shift}`, 1));
      } else if (BUTTON_ROWS[6].buttons.includes(note)) {
        osc.send(new OSC.Message(`/Key${note + BUTTON_ROWS[6].shift}`, 1));
      } else if (BUTTON_ROWS[7].buttons.includes(note)) {
        osc.send(new OSC.Message(`/Key${note + BUTTON_ROWS[7].shift}`, 1));
      } else if (FADER_KEYS.includes(note.toString())) {
        osc.send(new OSC.Message(`/Fader${note + FADER_KEY_SHIFT}`, 127));
      } else if (note === BUTTON_BLACKOUT) {
        isBlackoutEnabled = true;
        osc.send(new OSC.Message("/cmd", "Master 2.1 At 0"));
      }
    });

    inputSynth.addListener("noteoff", (e) => {
      const note = e.note.number;
      const channel = e.message.channel;

      if (BUTTON_ROWS[0].buttons.includes(note)) {
        osc.send(new OSC.Message(`/Key${note + BUTTON_ROWS[0].shift}`, 0));
      } else if (BUTTON_ROWS[1].buttons.includes(note)) {
        osc.send(new OSC.Message(`/Key${note + BUTTON_ROWS[1].shift}`, 0));
      } else if (BUTTON_ROWS[2].buttons.includes(note)) {
        // DO NOTHING
      } else if (BUTTON_ROWS[3].buttons.includes(note)) {
        osc.send(new OSC.Message(`/Key${note + BUTTON_ROWS[3].shift}`, 0));
      } else if (BUTTON_ROWS[4].buttons.includes(note)) {
        osc.send(new OSC.Message(`/Key${note + BUTTON_ROWS[4].shift}`, 0));
      } else if (BUTTON_ROWS[5].buttons.includes(note)) {
        osc.send(new OSC.Message(`/Key${note + BUTTON_ROWS[5].shift}`, 0));
      } else if (BUTTON_ROWS[6].buttons.includes(note)) {
        osc.send(new OSC.Message(`/Key${note + BUTTON_ROWS[6].shift}`, 0));
      } else if (BUTTON_ROWS[7].buttons.includes(note)) {
        osc.send(new OSC.Message(`/Key${note + BUTTON_ROWS[7].shift}`, 0));
      } else if (FADER_KEYS.includes(note.toString())) {
        osc.send(new OSC.Message(`/Fader${note + FADER_KEY_SHIFT}`, FADER_VALUE_ARRAY[note - 100]));
      } else if (note === BUTTON_BLACKOUT) {
        isBlackoutEnabled = false;
        osc.send(new OSC.Message("/cmd", `Master 2.1 At ${grandMaster}`));
      }
    });

    inputSynth.addListener("controlchange", (e) => {
      const control = e.controller.number;
      const channel = e.message.channel;
      const value = Math.round(+e.value * 100);

      const shift = 47;

      if (FADER_CONTROLS.includes(control)) {
        const faderIndex = FADER_CONTROLS.indexOf(control);
        FADER_VALUE_ARRAY[faderIndex] = value;
        osc.send(new OSC.Message(`/Fader${control + shift}`, value));
        Logger.info(`Fader ${control} set to ${value}%`);
      } else if (control === FADER_GRANDMASTER) {
        grandMaster = value;

        if (!isBlackoutEnabled) {
          osc.send(new OSC.Message("/cmd", `Master 2.1 At ${grandMaster}`));
        }
      }
    });

    const faderKeyLoop = async () => {
      for (let x = 0; x < FADER_KEYS.length; x++) {
        sendNoteOn(+FADER_KEYS[x], Channels.brightness10, Colors.DarkGray);
        await sleep(500);
        sendNoteOn(+FADER_KEYS[x], Channels.brightness10, Colors.Off);
      }
    };

    const softKeyLoop = async () => {
      for (let x = 0; x < SOFT_KEYS.length; x++) {
        sendNoteOn(+SOFT_KEYS[x], Channels.brightness10, Colors.DarkGray);
        await sleep(500);
        sendNoteOn(+SOFT_KEYS[x], Channels.brightness10, Colors.Off);
      }
    };

    const sanitityCheck = async () => {
      sendNoteOn(27, Channels.brightness100, Colors.Red);
      sendNoteOn(28, Channels.pulse1, Colors.Orange);
      sendNoteOn(35, Channels.pulse2, Colors.Yellow2);
      sendNoteOn(36, Channels.pulse3, Colors.Green2);
      sendNoteOn(43, Channels.pulse4, Colors.Green3);
      sendNoteOn(44, Channels.blinking1, Colors.Green4);
      sendNoteOn(51, Channels.blinking2, Colors.MediumGreen5);
      sendNoteOn(52, Channels.blinking3, Colors.Blue2);
      sendNoteOn(59, Channels.blinking4, Colors.Blue3);
      sendNoteOn(60, Channels.blinking5, Colors.Blue4);

      for (let x = 0; x < 16; x++) {
        sendNoteOn(x, x, Colors.White);
      }

      faderKeyLoop();
      await softKeyLoop();

      clearAllKeys();

      for (let x = 0; x < 127; x++) {
        sendNoteOn(x, Channels.brightness100, x);
      }

      faderKeyLoop();
      await softKeyLoop();

      clearAllKeys();

      Logger.success("Sanity check completed, all lights should be off");
      Logger.success("Please start the OSC Plugin in MA3 now");
    };

    sanitityCheck();
  })
  .catch((error) => {
    Logger.error(JSON.stringify(error));
  });
