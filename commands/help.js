async function help(textChannel) {
    const outputString = `
    **Here are a list of commands that are currently supported:**\`\`\`
!join - brings bot into current voice channel
!leave - removes bot from current voice channel
!queue - shows current songs in queue
!play - play a song by entering a url or a phrase to search by
!skip - skip current song
!clear - clear current song and songs in queue
!volume - adjust volume of current song and future songs
!nowplaying - shows details of currently playing song
!help - lists available commands\`\`\``;
    return textChannel.send(outputString);
}

module.exports = {
	help,
};