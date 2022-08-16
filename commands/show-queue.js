function showQueue(serverQueue, textChannel) {

    let outputString = `***Currently in queue:***\n`;
    if (!serverQueue.songs.length) {
        outputString = "Not currently playing anything.\n";
    } else {
        serverQueue.songs.map((m,i) => {
            outputString+= `**${++i}:** ${m.title}\n`;
        });
    }

    return textChannel.send(outputString);
}

module.exports = {
    showQueue
};