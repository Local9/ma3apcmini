//ma3apcminimk2color v1.0.5 by ArtGateOne
import easymidi from "easymidi";
import osc from "osc";
import ApcMini from "./class/apcmini.js";

console.log("Akai APCmini mk2 color MA3 OSC");

const apcMiniInstance = new ApcMini("APC mini mk2", "APC mini mk2", "127.0.0.1", 8001, "127.0.0.1", 8000);
apcMiniInstance.brightnessLevel = 6;
apcMiniInstance.setupExecutor(0, 9, 21, 8);

//Config
const LOGO_COLOR = 60;
const FADER_INDICATOR_STATE = 1; //0 = off, 1 = on

var faderArray = [0, 0, 0, 0, 0, 0, 0, 0];

var GrandMaster = 100;

var page = 1;
var BO = 0;
var clear = 0;

// // Create an osc.js UDP Port listening on port 8000.
// var udpPort = new osc.UDPPort({
//   localAddress: LOCAL_IP,
//   localPort: LOCAL_PORT,
//   metadata: true,
// });

// // Listen for incoming OSC messages.
// udpPort.on("message", function (oscMsg, timeTag, info) {
//   if (clear == 0) {
//     midiclear();
//     clear = 1;
//   }

//   if (oscMsg.address == "/Page") {
//     change_page(oscMsg.args[0].value);
//   } else if (oscMsg.address == "/Key101") {
//     light_executor(0, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key102") {
//     light_executor(1, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key103") {
//     light_executor(2, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key104") {
//     light_executor(3, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key105") {
//     light_executor(4, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key106") {
//     light_executor(5, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key107") {
//     light_executor(6, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key108") {
//     light_executor(7, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key201") {
//     light_executor(8, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key202") {
//     light_executor(9, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key203") {
//     light_executor(10, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key204") {
//     light_executor(11, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key205") {
//     light_executor(12, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key206") {
//     light_executor(13, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key207") {
//     light_executor(14, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key208") {
//     light_executor(15, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key116") {
//     light_executor(24, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key117") {
//     light_executor(25, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key118") {
//     light_executor(26, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key119") {
//     light_executor(27, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key120") {
//     light_executor(28, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key121") {
//     light_executor(29, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key122") {
//     light_executor(30, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key123") {
//     light_executor(31, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key131") {
//     light_executor(32, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key132") {
//     light_executor(33, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key133") {
//     light_executor(34, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key134") {
//     light_executor(35, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key135") {
//     light_executor(36, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key136") {
//     light_executor(37, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key137") {
//     light_executor(38, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key138") {
//     light_executor(39, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key146") {
//     light_executor(40, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key147") {
//     light_executor(41, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key148") {
//     light_executor(42, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key149") {
//     light_executor(43, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key150") {
//     light_executor(44, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key151") {
//     light_executor(45, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key152") {
//     light_executor(46, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key153") {
//     light_executor(47, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key161") {
//     light_executor(48, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key162") {
//     light_executor(49, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key163") {
//     light_executor(50, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key164") {
//     light_executor(51, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key165") {
//     light_executor(52, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key166") {
//     light_executor(53, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key167") {
//     light_executor(54, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key168") {
//     light_executor(55, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key176") {
//     light_executor(56, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key177") {
//     light_executor(57, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key178") {
//     light_executor(58, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key179") {
//     light_executor(59, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key180") {
//     light_executor(60, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key181") {
//     light_executor(61, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key182") {
//     light_executor(62, oscMsg.args[0].value, oscMsg.args[1].value);
//   } else if (oscMsg.address == "/Key183") {
//     light_executor(63, oscMsg.args[0].value, oscMsg.args[1].value);
//   }
// });

// // Open the socket.
// udpPort.open();

// // When the port is read, send an OSC message to, say, SuperCollider
// udpPort.on("ready", function () {
//   console.log("READY");
//   console.log("Please start the OSC plugin to receive LED feedback.");
// });

// input.on("cc", function (msg) {
//   //Fader send OSC

//   if (msg.controller >= 48 && msg.controller <= 55) {
//     var OSCaddress = "/Fader20" + (msg.controller - 47);
//     faderArray[msg.controller - 48] = msg.value;
//     udpPort.send({ address: OSCaddress, args: [{ type: "i", value: msg.value }] }, REMOTE_IP, REMOTE_PORT);
//   } else if (msg.controller == 56) {
//     //Grand Master Fader
//     GrandMaster = msg.value * 0.8;

//     if (BO == 0) {
//       udpPort.send(
//         {
//           address: "/cmd",
//           args: [{ type: "s", value: "Master 2.1 At " + GrandMaster }],
//         },
//         REMOTE_IP,
//         REMOTE_PORT
//       );
//     }
//   }
// });

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

// //midi clear function
// function midiclear() {
//   for (i = 0; i < 128; i++) {
//     output.send("noteon", { note: i, velocity: 0, channel: 0 });
//     //sleep(10, function () { });
//   }
//   return;
// }

// function light_executor(note, status, color) {
//   channel = BRIGHTNESS_LEVEL;

//   if (color == "#000000") {
//     if (status == 1) {
//       velocity = EXECUTOR_COLOR_ON;
//     } else if (status == 0) {
//       velocity = EXECUTOR_COLOR_OFF;
//     } else {
//       velocity = EXECUTOR_COLOR_EMPTY;
//     }
//   } else {
//     if (status == 1) {
//       channel = EXECUTOR_FX;
//     }
//     velocity = getClosestVelocity(color);
//   }

//   output.send("noteon", { note: note, velocity: velocity, channel: channel });
//   return;
// }

// function light_page_button(note) {
//   channel = BRIGHTNESS_LEVEL;
//   output.send("noteon", { note: page + 111, velocity: 0, channel: 0 });
//   output.send("noteon", { note: note, velocity: 1, channel: 0 });
//   page = note - 111;
// }

// function change_page(page_new) {
//   output.send("noteon", { note: page + 111, velocity: 0, channel: 0 });
//   output.send("noteon", { note: page_new + 111, velocity: 1, channel: 0 });
//   page = page_new;
// }

// function light_fader(note, velocity) {
//   output.send("noteon", { note: note, velocity: velocity, channel: BRIGHTNESS_LEVEL });

//   return;
// }

// // Mapa kolorów do velocity
// const colorToVelocity = {
//   "#000000": 0,
//   "#1E1E1E": 1,
//   "#7F7F7F": 2,
//   "#FFFFFF": 3,
//   "#FF4C4C": 4,
//   "#FF0000": 5,
//   "#590000": 6,
//   "#190000": 7,
//   "#FFBD6C": 8,
//   "#FF5400": 9,
//   "#591D00": 10,
//   "#271B00": 11,
//   "#FFFF4C": 12,
//   "#FFFF00": 13,
//   "#595900": 14,
//   "#191900": 15,
//   "#88FF4C": 16,
//   "#54FF00": 17,
//   "#1D5900": 18,
//   "#142B00": 19,
//   "#4CFF4C": 20,
//   "#00FF00": 21,
//   "#005900": 22,
//   "#001900": 23,
//   "#4CFF5E": 24,
//   "#00FF19": 25,
//   "#00590D": 26,
//   "#001902": 27,
//   "#4CFF88": 28,
//   "#00FF55": 29,
//   "#00591D": 30,
//   "#001F12": 31,
//   "#4CFFB7": 32,
//   "#00FF99": 33,
//   "#005935": 34,
//   "#001912": 35,
//   "#4CC3FF": 36,
//   "#00A9FF": 37,
//   "#004152": 38,
//   "#001019": 39,
//   "#4C88FF": 40,
//   "#0055FF": 41,
//   "#001D59": 42,
//   "#000819": 43,
//   "#4C4CFF": 44,
//   "#0000FF": 45,
//   "#000059": 46,
//   "#000019": 47,
//   "#874CFF": 48,
//   "#5400FF": 49,
//   "#190064": 50,
//   "#0F0030": 51,
//   "#FF4CFF": 52,
//   "#FF00FF": 53,
//   "#590059": 54,
//   "#190019": 55,
//   "#FF4C87": 56,
//   "#FF0054": 57,
//   "#59001D": 58,
//   "#220013": 59,
//   "#FF1500": 60,
//   "#993500": 61,
//   "#795100": 62,
//   "#436400": 63,
//   "#033900": 64,
//   "#005735": 65,
//   "#00547F": 66,
//   "#0000FF": 67,
//   "#00454F": 68,
//   "#2500CC": 69,
//   "#7F7F7F": 70,
//   "#202020": 71,
//   "#FF0000": 72,
//   "#BDFF2D": 73,
//   "#AFED06": 74,
//   "#64FF09": 75,
//   "#108B00": 76,
//   "#00FF87": 77,
//   "#00A9FF": 78,
//   "#002AFF": 79,
//   "#3F00FF": 80,
//   "#7A00FF": 81,
//   "#B21A7D": 82,
//   "#402100": 83,
//   "#FF4A00": 84,
//   "#88E106": 85,
//   "#72FF15": 86,
//   "#00FF00": 87,
//   "#3BFF26": 88,
//   "#59FF71": 89,
//   "#38FFCC": 90,
//   "#5B8AFF": 91,
//   "#3151C6": 92,
//   "#877FE9": 93,
//   "#D31DFF": 94,
//   "#FF005D": 95,
//   "#FF7F00": 96,
//   "#B9B000": 97,
//   "#90FF00": 98,
//   "#835D07": 99,
//   "#392b00": 100,
//   "#144C10": 101,
//   "#0D5038": 102,
//   "#15152A": 103,
//   "#16205A": 104,
//   "#693C1C": 105,
//   "#A8000A": 106,
//   "#DE513D": 107,
//   "#D86A1C": 108,
//   "#FFE126": 109,
//   "#9EE12F": 110,
//   "#67B50F": 111,
//   "#1E1E30": 112,
//   "#DCFF6B": 113,
//   "#80FFBD": 114,
//   "#9A99FF": 115,
//   "#8E66FF": 116,
//   "#404040": 117,
//   "#757575": 118,
//   "#E0FFFF": 119,
//   "#A00000": 120,
//   "#350000": 121,
//   "#1AD000": 122,
//   "#074200": 123,
//   "#B9B000": 124,
//   "#3F3100": 125,
//   "#B35F00": 126,
//   "#4B1502": 127,
// };

// // Funkcja konwertująca kolor z heksadecymalnego na wartości RGB z walidacją
// function hexToRgb(hex) {
//   if (!/^#([0-9A-F]{3}){1,2}$/i.test(hex)) {
//     throw new Error("Nieprawidłowy format koloru: " + hex);
//   }
//   let bigint = parseInt(hex.slice(1), 16);
//   let r = (bigint >> 16) & 255;
//   let g = (bigint >> 8) & 255;
//   let b = bigint & 255;
//   return { r, g, b };
// }

// // Funkcja obliczająca odległość Manhattan między dwoma kolorami RGB
// function colorDistanceManhattan(color1, color2) {
//   return Math.abs(color1.r - color2.r) + Math.abs(color1.g - color2.g) + Math.abs(color1.b - color2.b);
// }

// // Funkcja zwracająca velocity dla najbardziej zbliżonego koloru
// function getClosestVelocity(color) {
//   let targetRgb = hexToRgb(color);
//   let closestColor = null;
//   let closestDistance = Infinity;

//   for (let key in colorToVelocity) {
//     let currentRgb = hexToRgb(key);
//     let distance = colorDistanceManhattan(targetRgb, currentRgb);
//     if (distance < closestDistance) {
//       closestDistance = distance;
//       closestColor = key;
//     }
//   }

//   return colorToVelocity[closestColor];
// }
