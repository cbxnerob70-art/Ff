module.exports.config = {
    name: "joinNoti",
    eventType: ["log:subscribe"],
    version: "1.0.0",
    credits: "NM Nerob",
    description: "Aesthetic welcome message for new members",
};

module.exports.run = async function({ api, event }) {
    const { threadID, logMessageData } = event;

    // Skip if the bot itself was added
    if (logMessageData.addedParticipants.some(p => p.userFbId == api.getCurrentUserID())) return;

    let mentions = [];
    let names = [];

    for (const participant of logMessageData.addedParticipants) {
        names.push(participant.fullName);
        mentions.push({
            tag: participant.fullName,
            id: participant.userFbId
        });
    }

    const nameList = names.join(', ');
    const message = `
╔══ஓ๑♡๑ஓ══╗
  ✧・ﾟ𝓦𝓮𝓵𝓬𝓸𝓶𝓮・ﾟ✧
╚══ஓ๑♡๑ஓ══╝

🌷 𝐇𝐞𝐥𝐥𝐨 @${nameList} ♡
🕊️ A new soul drifts into our space...  
🌙 Soft steps echo in this corner of stars...

💌 𝒀𝒐𝒖 𝒂𝒓𝒆 𝒉𝒆𝒓𝒆, 𝒂𝒏𝒅 𝒕𝒉𝒆 𝒘𝒐𝒓𝒍𝒅 𝒊𝒔 𝒃𝒓𝒊𝒈𝒉𝒕𝒆𝒓.  
☁️ Sit back, sip peace, and let joy settle in...

🌸 𝐌𝐚𝐲 𝐲𝐨𝐮 𝐟𝐢𝐧𝐝 𝐜𝐨𝐦𝐟𝐨𝐫𝐭, 𝐥𝐚𝐮𝐠𝐡𝐭𝐞𝐫, 𝐚𝐧𝐝 𝐜𝐡𝐞𝐞𝐫.  
𝒀𝒐𝒖 𝒃𝒆𝒍𝒐𝒏𝒈 𝒉𝒆𝒓𝒆 ♡
`;

    return api.sendMessage({
        body: message,
        mentions
    }, threadID);
};
