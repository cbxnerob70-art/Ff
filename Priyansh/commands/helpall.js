module.exports.config = {
  name: "helpall",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "💖 NM Nerob",
  description: "Show all commands grouped by category with emojis",
  commandCategory: "🛠️ System",
  usages: "",
  cooldowns: 1,
  envConfig: {
    autoUnsend: false,
    delayUnsend: 300
  }
};

module.exports.languages = {
  "en": {
    "header": "🌸✨ 𝓗𝓮𝓻𝓮 𝓪𝓻𝓮 𝓪𝓵𝓵 𝓬𝓸𝓶𝓶𝓪𝓷𝓭𝓼 𝔀𝗂𝘁𝗁 𝚌𝗮𝘁𝗲𝗴𝗼𝗿𝘆 𝗲𝗺𝗼𝗷𝗶𝘀 ✨🌸",
    "footer": "💖 𝓒𝓻𝓮𝓪𝓽𝓸𝓻: NM Nerob 💖",
    "usageNote": "📌 𝕌𝕤𝕖: `/help commandName` 𝕗𝕠𝕣 𝕕𝕖𝕥𝕒𝕚𝕝𝕤"
  }
};

const categoryEmojis = {
  "system": "🛠️",
  "entertainment": "🎬",
  "fun": "🎉",
  "admin": "👑",
  "settings": "⚙️",
  "information": "📚",
  "misc": "✨"
};

function fancyFont(text) {
  // Simple function to convert normal text to a cute/fancy font using Unicode letters
  const map = {
    a: "𝓪", b: "𝓫", c: "𝓬", d: "𝓭", e: "𝓮", f: "𝓯", g: "𝓰", h: "𝓱", i: "𝓲", j: "𝓳",
    k: "𝓴", l: "𝓵", m: "𝓶", n: "𝓷", o: "𝓸", p: "𝓹", q: "𝓺", r: "𝓻", s: "𝓼", t: "𝓽",
    u: "𝓾", v: "𝓿", w: "𝔀", x: "𝔁", y: "𝔂", z: "𝔃",
    A: "𝓐", B: "𝓑", C: "𝓒", D: "𝓓", E: "𝓔", F: "𝓕", G: "𝓖", H: "𝓗", I: "𝓘", J: "𝓙",
    K: "𝓚", L: "𝓛", M: "𝓜", N: "𝓝", O: "𝓞", P: "𝓟", Q: "𝓠", R: "𝓡", S: "𝓢", T: "𝓣",
    U: "𝓤", V: "𝓥", W: "𝓦", X: "𝓧", Y: "𝓨", Z: "𝓩",
    " ": " ", "/": "/", "`": "`", ".": ".", ",": ",", "?": "?", "!": "!", ":": ":"
  };
  return text.split("").map(c => map[c] || c).join("");
}

module.exports.run = async function({ api, event, getText }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;

  // Group commands by category
  const categorized = {};
  for (const [name, cmd] of commands) {
    const cat = (cmd.config.commandCategory || "misc").toLowerCase();
    if (!categorized[cat]) categorized[cat] = [];
    categorized[cat].push(name);
  }

  // Sort categories and commands alphabetically
  const sortedCats = Object.keys(categorized).sort();
  for (const cat of sortedCats) categorized[cat].sort();

  // Build the message
  let msg = fancyFont(getText("header")) + "\n\n";

  for (const cat of sortedCats) {
    const emoji = categoryEmojis[cat] || "✨";
    msg += `${emoji}  𝓒𝓪𝓽𝓮𝓰𝓸𝓻𝔂: ${fancyFont(cat.charAt(0).toUpperCase() + cat.slice(1))}\n`;
    for (const cmdName of categorized[cat]) {
      msg += `・ /${cmdName}\n`;
    }
    msg += "\n";
  }

  msg += fancyFont(getText("footer")) + "\n" + fancyFont(getText("usageNote"));

  return api.sendMessage(msg, threadID, messageID);
};
