module.exports.config = {
 name: "fun",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "nerob",
 description: "RANDOM video",
 commandCategory: "Random video",
 usages: "fun",
 cooldowns: 2,
 dependencies: {
 "request":"",
 "fs-extra":"",
 "axios":""
 }
 
};

module.exports.run = async({api,event,args,Users,Threads,Currencies}) => {
const axios = global.nodemodule["axios"];
const request = global.nodemodule["request"];
const fs = global.nodemodule["fs-extra"];
 var link = [
"https://i.imgur.com/OGbJcmy.mp4",
"https://i.imgur.com/nDvBRxD.mp4",
"https://i.imgur.com/wrdlWG1.mp4", 
"https://i.imgur.com/YRgOXTE.mp4",
"https://i.imgur.com/wBQliSI.mp4", 
"https://i.imgur.com/6sdSE05.mp4",  
"https://i.imgur.com/1cfNvgZ.mp4", 
"https://i.imgur.com/aos5eZP.mp4",
"https://i.imgur.2com/eNYJNlA.mp4",  
"https://i.imgur.com/ZwYILLO.mp4", 
"https://i.imgur.com/qjwpsrL.mp4",  
"https://i.imgur.com/Hhm8GZF.mp4",
"https://i.imgur.com/ljKTXdJ.mp4", 
"https://i.imgur.com/16n2doP.mp4", 
"https://i.imgur.com/A1yH4c3.mp4", 
"https://i.imgur.com/9CGJS7a.mp4",
 ];
 var callback = () => api.sendMessage({body:`meow🧛‍♀️`,attachment: fs.createReadStream(__dirname + "/cache/1.mp4")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.mp4"));
 return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/1.mp4")).on("close",() => callback());
 };
