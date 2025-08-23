const fs = require("fs-extra");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");
const path = require("path");

    module.exports.config = {
  name: "pair",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
  description: "Randomly pairs you with someone in the group with a fun compatibility percentage.",
  commandCategory: "fun",
  usages: "",
  dependencies: {
    "axios": "",
    "fs-extra": ""
  },
  cooldowns: 15
}

module.exports.run = async function ({ args, Users, Threads, api, event }) {
  const { loadImage, createCanvas } = require("canvas");
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];

  let pathImg = __dirname + "/cache/background.png";
  let pathAvt1 = __dirname + "/cache/Avtmot.png";
  let pathAvt2 = __dirname + "/cache/Avthai.png";

  const id1 = event.senderID;
  const name1 = await Users.getNameUser(id1);
  const threadInfo = await api.getThreadInfo(event.threadID);
  const all = threadInfo.userInfo;

  let gender1;
  for (let c of all) {
    if (c.id == id1) gender1 = c.gender;
  }

  const botID = api.getCurrentUserID();
  let candidates = [];

  if (gender1 === "FEMALE") {
    candidates = all.filter(u => u.gender === "MALE" && u.id !== id1 && u.id !== botID).map(u => u.id);
  } else if (gender1 === "MALE") {
    candidates = all.filter(u => u.gender === "FEMALE" && u.id !== id1 && u.id !== botID).map(u => u.id);
  } else {
    candidates = all.filter(u => u.id !== id1 && u.id !== botID).map(u => u.id);
  }

  if (candidates.length === 0) {
    return api.sendMessage("❌ Couldn't find a match for you in this group.", event.threadID, event.messageID);
  }

  const id2 = candidates[Math.floor(Math.random() * candidates.length)];
  const name2 = await Users.getNameUser(id2);

  // ✅ Clean random percentage between 0-100
  const percentage = Math.floor(Math.random() * 101);

  const backgrounds = [
    "https://i.postimg.cc/wjJ29HRB/background1.png",
    "https://i.postimg.cc/zf4Pnshv/background2.png",
    "https://i.postimg.cc/5tXRQ46D/background3.png"
  ];
  const backgroundUrl = backgrounds[Math.floor(Math.random() * backgrounds.length)];

  // Download avatars and background
  const avatar1 = (
    await axios.get(`https://graph.facebook.com/${id1}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, {
      responseType: "arraybuffer"
    })
  ).data;
  fs.writeFileSync(pathAvt1, Buffer.from(avatar1, "utf-8"));

  const avatar2 = (
    await axios.get(`https://graph.facebook.com/${id2}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, {
      responseType: "arraybuffer"
    })
  ).data;
  fs.writeFileSync(pathAvt2, Buffer.from(avatar2, "utf-8"));

  const background = (
    await axios.get(backgroundUrl, {
      responseType: "arraybuffer",
    })
  ).data;
  fs.writeFileSync(pathImg, Buffer.from(background, "utf-8"));

  // Canvas generation
  const baseImage = await loadImage(pathImg);
  const baseAvt1 = await loadImage(pathAvt1);
  const baseAvt2 = await loadImage(pathAvt2);
  const canvas = createCanvas(baseImage.width, baseImage.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(baseAvt1, 100, 150, 300, 300);
  ctx.drawImage(baseAvt2, 900, 150, 300, 300);

  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  fs.removeSync(pathAvt1);
  fs.removeSync(pathAvt2);

  // Send final message
  return api.sendMessage({
    body: `💞 Congratulations, ${name1} has been paired with ${name2}!\n💘 Compatibility: ${percentage}%`,
    mentions: [{
      tag: `${name2}`,
      id: id2
    }],
    attachment: fs.createReadStream(pathImg)
  },
    event.threadID,
    () => fs.unlinkSync(pathImg),
    event.messageID);
}
