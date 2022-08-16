const { prefix } = require('../config.json');

const ytsr = require("youtube-sr").default;

async function search(serverQueue, term, memberId, textChannel) {
    let results = [];
    const videos = await ytsr.search(term, { limit: 5 });
    
    let outputString = `Enter **${prefix}play** 1-5 to select a song\n`;
    videos.map((m,i) => {
        results.push(m.url);
        outputString+= `**${++i}:** ${m.title} (${m.durationFormatted})\n`;
    });

    serverQueue.searchResults.set(memberId, results);
    return textChannel.send(outputString);
}

module.exports = {
    search
};