module.exports.config = {
  name: "pair3",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭 - Modified by ChatGPT",
  description: "Pairs a female and a male with a custom background.",
  commandCategory: "Giải trí",
  usages: "",
  dependencies: {
    "axios": "",
    "fs-extra": ""
  },
  cooldowns: 0
};

module.exports.run = async function ({ args, Users, Threads, api, event, Currencies }) {
  const { loadImage, createCanvas } = require("canvas");
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  let pathImg = __dirname + "/cache/itachi.png";
  let pathAvt1 = __dirname + "/cache/femaleAvt.png";
  let pathAvt2 = __dirname + "/cache/maleAvt.png";

  const botID = api.getCurrentUserID();
  var ThreadInfo = await api.getThreadInfo(event.threadID);
  var all = ThreadInfo.userInfo;

  // Get female users excluding the bot
  const females = all.filter(user => user.gender === "FEMALE" && user.id !== botID);
  // Get male users excluding the bot
  const males = all.filter(user => user.gender === "MALE" && user.id !== botID);

  if (females.length === 0 || males.length === 0) {
    return api.sendMessage("Not enough male/female users in the group to pair.", event.threadID);
  }

  // Select random female and male
  const female = females[Math.floor(Math.random() * females.length)];
  const male = males[Math.floor(Math.random() * males.length)];

  const name1 = await Users.getNameUser(female.id);
  const name2 = await Users.getNameUser(male.id);

  const loveRates = ["0", "-1", "99.99", "-99", "-100", "101", "0.01"];
  const normalRate = Math.floor(Math.random() * 100) + 1;
  const combinedRates = new Array(9).fill(`${normalRate}`).concat(loveRates);
  const finalRate = combinedRates[Math.floor(Math.random() * combinedRates.length)];

  // Use the provided background
  const backgroundUrl = "https://i.postimg.cc/xjtNCkL6/itachi.jpg";

  let getAvtFemale = (
    await axios.get(
      `https://graph.facebook.com/${female.id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      { responseType: "arraybuffer" }
    )
  ).data;
  fs.writeFileSync(pathAvt1, Buffer.from(getAvtFemale, "utf-8"));

  let getAvtMale = (
    await axios.get(
      `https://graph.facebook.com/${male.id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
      { responseType: "arraybuffer" }
    )
  ).data;
  fs.writeFileSync(pathAvt2, Buffer.from(getAvtMale, "utf-8"));

  let getBackground = (
    await axios.get(backgroundUrl, {
      responseType: "arraybuffer",
    })
  ).data;
  fs.writeFileSync(pathImg, Buffer.from(getBackground, "utf-8"));

  let baseImage = await loadImage(pathImg);
  let baseAvt1 = await loadImage(pathAvt1);
  let baseAvt2 = await loadImage(pathAvt2);
  let canvas = createCanvas(baseImage.width, baseImage.height);
  let ctx = canvas.getContext("2d");
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(baseAvt1, 200, 250, 140, 140); // female avatar
  ctx.drawImage(baseAvt2, 600, 250, 140, 140); // male avatar

  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  fs.removeSync(pathAvt1);
  fs.removeSync(pathAvt2);

  return api.sendMessage({
    body: `💘 Congratulations ${name1} has been paired with ${name2} 💘\n❤️ Compatibility: ${finalRate}%`,
    mentions: [{
      tag: `${name2}`,
      id: male.id
    }],
    attachment: fs.createReadStream(pathImg)
  }, event.threadID, () => fs.unlinkSync(pathImg), event.messageID);
};
