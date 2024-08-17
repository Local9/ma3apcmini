//ma3apcminimk2color v1.0.5 by ArtGateOne
import ApcMini from "./class/apcmini.js";

const apcMiniInstance = new ApcMini("APC mini mk2", "APC mini mk2", "127.0.0.1", 8001, "127.0.0.1", 8000, true);
apcMiniInstance.brightnessLevel = 6;
apcMiniInstance.setupExecutor(0, 9, 21, 8);

// input.on("noteon", function (msg) {
//   //recive midi keys and send to osc

//   if (msg.note >= 0 && msg.note <= 7) {
//     udpPort.send({ address: "/Key" + (msg.note + 101), args: [{ type: "i", value: 1 }] }, REMOTE_IP, REMOTE_PORT);
//   } else if (msg.note >= 8 && msg.note <= 15) {
//     udpPort.send({ address: "/Key" + (msg.note + 193), args: [{ type: "i", value: 1 }] }, REMOTE_IP, REMOTE_PORT);
//   } else if (msg.note >= 16 && msg.note <= 23) {
//     //do nothing
//   } else if (msg.note >= 24 && msg.note <= 31) {
//     udpPort.send({ address: "/Key" + (msg.note + 92), args: [{ type: "i", value: 1 }] }, REMOTE_IP, REMOTE_PORT);
//   } else if (msg.note >= 32 && msg.note <= 39) {
//     udpPort.send({ address: "/Key" + (msg.note + 99), args: [{ type: "i", value: 1 }] }, REMOTE_IP, REMOTE_PORT);
//   } else if (msg.note >= 40 && msg.note <= 47) {
//     udpPort.send({ address: "/Key" + (msg.note + 106), args: [{ type: "i", value: 1 }] }, REMOTE_IP, REMOTE_PORT);
//   } else if (msg.note >= 48 && msg.note <= 55) {
//     udpPort.send({ address: "/Key" + (msg.note + 113), args: [{ type: "i", value: 1 }] }, REMOTE_IP, REMOTE_PORT);
//   } else if (msg.note >= 56 && msg.note <= 63) {
//     udpPort.send({ address: "/Key" + (msg.note + 120), args: [{ type: "i", value: 1 }] }, REMOTE_IP, REMOTE_PORT);
//   } else if (msg.note >= 100 && msg.note <= 107) {
//     udpPort.send({ address: "/Fader" + (msg.note + 101), args: [{ type: "i", value: 127 }] }, REMOTE_IP, REMOTE_PORT);
//     output.send("noteon", { note: msg.note, velocity: msg.velocity, channel: 0 });
//   } else if (msg.note == 112) {
//     light_page_button(msg.note);
//     udpPort.send({ address: "/cmd", args: [{ type: "s", value: apcMiniInstance.commands.one }] }, REMOTE_IP, REMOTE_PORT);
//   } else if (msg.note == 113) {
//     light_page_button(msg.note);
//     udpPort.send({ address: "/cmd", args: [{ type: "s", value: apcMiniInstance.commands.two }] }, REMOTE_IP, REMOTE_PORT);
//   } else if (msg.note == 114) {
//     light_page_button(msg.note);
//     udpPort.send({ address: "/cmd", args: [{ type: "s", value: apcMiniInstance.commands.three }] }, REMOTE_IP, REMOTE_PORT);
//   } else if (msg.note == 115) {
//     light_page_button(msg.note);
//     udpPort.send({ address: "/cmd", args: [{ type: "s", value: apcMiniInstance.commands.four }] }, REMOTE_IP, REMOTE_PORT);
//   } else if (msg.note == 116) {
//     light_page_button(msg.note);
//     udpPort.send({ address: "/cmd", args: [{ type: "s", value: apcMiniInstance.commands.five }] }, REMOTE_IP, REMOTE_PORT);
//   } else if (msg.note == 117) {
//     light_page_button(msg.note);
//     udpPort.send({ address: "/cmd", args: [{ type: "s", value: apcMiniInstance.commands.six }] }, REMOTE_IP, REMOTE_PORT);
//   } else if (msg.note == 118) {
//     light_page_button(msg.note);
//     udpPort.send({ address: "/cmd", args: [{ type: "s", value: apcMiniInstance.commands.seven }] }, REMOTE_IP, REMOTE_PORT);
//   } else if (msg.note == 119) {
//     light_page_button(msg.note);
//     udpPort.send({ address: "/cmd", args: [{ type: "s", value: apcMiniInstance.commands.eight }] }, REMOTE_IP, REMOTE_PORT);
//   } else if (msg.note == 122) {
//     //BO
//     BO = 1;
//     udpPort.send({ address: "/cmd", args: [{ type: "s", value: "Master 2.1 At 0" }] }, REMOTE_IP, REMOTE_PORT);
//   }
// });

// input.on("noteoff", function (msg) {
//   //recive midi keys and send to osc

//   if (msg.note >= 0 && msg.note <= 7) {
//     udpPort.send({ address: "/Key" + (msg.note + 101), args: [{ type: "i", value: 0 }] }, REMOTE_IP, REMOTE_PORT);
//   } else if (msg.note >= 8 && msg.note <= 15) {
//     udpPort.send({ address: "/Key" + (msg.note + 193), args: [{ type: "i", value: 0 }] }, REMOTE_IP, REMOTE_PORT);
//   }
//   if (msg.note >= 16 && msg.note <= 23) {
//     //do nothing
//   } else if (msg.note >= 24 && msg.note <= 31) {
//     udpPort.send({ address: "/Key" + (msg.note + 92), args: [{ type: "i", value: 0 }] }, REMOTE_IP, REMOTE_PORT);
//   } else if (msg.note >= 32 && msg.note <= 39) {
//     udpPort.send({ address: "/Key" + (msg.note + 99), args: [{ type: "i", value: 0 }] }, REMOTE_IP, REMOTE_PORT);
//   } else if (msg.note >= 40 && msg.note <= 47) {
//     udpPort.send({ address: "/Key" + (msg.note + 106), args: [{ type: "i", value: 0 }] }, REMOTE_IP, REMOTE_PORT);
//   } else if (msg.note >= 48 && msg.note <= 55) {
//     udpPort.send({ address: "/Key" + (msg.note + 113), args: [{ type: "i", value: 0 }] }, REMOTE_IP, REMOTE_PORT);
//   } else if (msg.note >= 56 && msg.note <= 63) {
//     udpPort.send({ address: "/Key" + (msg.note + 120), args: [{ type: "i", value: 0 }] }, REMOTE_IP, REMOTE_PORT);
//   } else if (msg.note >= 100 && msg.note <= 107) {
//     udpPort.send({ address: "/Fader" + (msg.note + 101), args: [{ type: "i", value: faderArray[msg.note - 100] }] }, REMOTE_IP, REMOTE_PORT);
//     output.send("noteon", { note: msg.note, velocity: msg.velocity, channel: 0 });
//   } else if (msg.note == 122) {
//     //BO
//     BO = 0;
//     udpPort.send({ address: "/cmd", args: [{ type: "s", value: "Master 2.1 At " + GrandMaster }] }, REMOTE_IP, REMOTE_PORT);
//   }
// });
