/*



*/

import { Channels } from "./enums/channels";
import { FaderKeys } from "./enums/faderKeys";
import { SoftKeys } from "./enums/softkeys";
import { sleep } from "./lib/func";
import Logger from "./lib/logger";
import { WebMidi } from "webmidi";

const midiDevice: string = "APC mini mk2";

const buttonRows = {
  0: { buttons: [0, 1, 2, 3, 4, 5, 6, 7] }, // BOTTOM
  1: { buttons: [8, 9, 10, 11, 12, 13, 14, 15] },
  2: { buttons: [16, 17, 18, 19, 20, 21, 22, 23] }, // we leave this row alone
  3: { buttons: [24, 25, 26, 27, 28, 29, 30, 31] },
  4: { buttons: [32, 33, 34, 35, 36, 37, 38, 39] },
  5: { buttons: [40, 41, 42, 43, 44, 45, 46, 47] },
  6: { buttons: [48, 49, 50, 51, 52, 53, 54, 55] },
  7: { buttons: [56, 57, 58, 59, 60, 61, 62, 63] }, // TOP
};

const blackoutButton = 122;

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

    const clearMidis = () => {
      for (let x = 0; x < 128; x++) {
        midiOutputs.sendNoteOn(x, { channels: 1, rawAttack: 0 });
      }
    };

    clearMidis();

    inputSynth.addListener("noteon", (e) => {
      Logger.info(`Note on: ${e.note.number} on channel ${e.message.channel}`);
    });

    inputSynth.addListener("noteoff", (e) => {
      Logger.info(`Note off: ${e.note.number} on channel ${e.message.channel}`);
    });

    inputSynth.addListener("controlchange", (e) => {
      Logger.info(`Control change: ${e.controller.number} on channel ${e.message.channel}, value: ${e.value}`);
    });

    const softKeyShift = 111;

    const faderKeyLoop = async () => {
      const faderKeyValues = Object.keys(FaderKeys).filter((v) => !isNaN(Number(v)));

      for (let x = 0; x < faderKeyValues.length; x++) {
        midiOutputs.sendNoteOn(+faderKeyValues[x], { channels: 1, rawAttack: 1 });
        await sleep(500);
        midiOutputs.sendNoteOn(+faderKeyValues[x], { channels: 1, rawAttack: 0 });
      }
    };

    const softKeyLoop = async () => {
      const softkeyValues = Object.keys(SoftKeys).filter((v) => !isNaN(Number(v)));

      for (let x = 0; x < softkeyValues.length; x++) {
        midiOutputs.sendNoteOn(+softkeyValues[x], { channels: 1, rawAttack: 1 });
        await sleep(500);
        midiOutputs.sendNoteOn(+softkeyValues[x], { channels: 1, rawAttack: 0 });
      }
    };

    const sanitityCheck = async () => {
      midiOutputs.sendNoteOn(27, { channels: Channels.brightness100, rawAttack: 5 });
      midiOutputs.sendNoteOn(28, { channels: Channels.pulse1, rawAttack: 9 });
      midiOutputs.sendNoteOn(35, { channels: Channels.pulse2, rawAttack: 13 });
      midiOutputs.sendNoteOn(36, { channels: Channels.pulse3, rawAttack: 17 });
      midiOutputs.sendNoteOn(43, { channels: Channels.pulse4, rawAttack: 25 });
      midiOutputs.sendNoteOn(44, { channels: Channels.blinking1, rawAttack: 29 });
      midiOutputs.sendNoteOn(51, { channels: Channels.blinking2, rawAttack: 34 });
      midiOutputs.sendNoteOn(52, { channels: Channels.blinking3, rawAttack: 41 });
      midiOutputs.sendNoteOn(59, { channels: Channels.blinking4, rawAttack: 45 });
      midiOutputs.sendNoteOn(60, { channels: Channels.blinking5, rawAttack: 49 });

      for (let x = 0; x < 16; x++) {
        midiOutputs.sendNoteOn(x, { channels: x, rawAttack: 3 });
      }

      faderKeyLoop();
      await softKeyLoop();

      clearMidis();

      for (let x = 0; x < 127; x++) {
        midiOutputs.sendNoteOn(x, { channels: Channels.brightness100, rawAttack: x });
      }

      faderKeyLoop();
      await softKeyLoop();

      clearMidis();

      Logger.success("Sanity check completed, all lights should be off");
      Logger.success("Please start the OSC Plugin in MA3 now");
    };

    sanitityCheck();
  })
  .catch((error) => {
    Logger.error(JSON.stringify(error));
  });
