module.exports.config = {
  name: "leaderboard",
  version: "1.0.0",
  hasPermssion: 0,
  credits: " nerob",
  description: "Display the top users leaderboard",
  commandCategory: "General",
  usages: "leaderboard",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args, global, getText }) => {
  try {
    // ধরলাম global.data.allUserID তে ইউজার আইডি আছে এবং global.data.userBanned তে ইউজার এর currency বা score আছে
    // এখানে তোমার ডাটাবেজ/স্টোরেজ থেকে ইউজার ডাটা নিয়ে আসো
    const userScores = [];

    for (const userID of global.data.allUserID) {
      if (!global.data.userBanned.has(userID)) {
        // এখানে ধরে নিচ্ছি global.data.userBanned.get(userID) ইউজারের স্কোর
        const score = global.data.userBanned.get(userID) || 0;
        userScores.push({ userID, score });
      }
    }

    if (userScores.length === 0) return api.sendMessage("No users found in the leaderboard.", event.threadID);

    // স্কোর অনুসারে সাজানো (descending)
    userScores.sort((a, b) => b.score - a.score);

    // শুধু টপ 100 ইউজার দেখাবে
    const topUsers = userScores.slice(0, 100);

    // টপ 5 এর মেসেজ তৈরী (aesthetically)
    let message = "🏆✨ Top 5 Leaderboard ✨🏆\n\n";

    for (let i = 0; i < Math.min(5, topUsers.length); i++) {
      let user = topUsers[i];
      let name = global.data.userName.get(user.userID) || `User ${user.userID}`;
      message += `${i + 1}. 🎉 ${name} — ${user.score} points\n`;
    }

    message += "\n📊 Full leaderboard shows up to top 100 users.\n";

    api.sendMessage(message, event.threadID);
  } catch (error) {
    console.error(error);
    return api.sendMessage("An error occurred while fetching the leaderboard.", event.threadID);
  }
};
