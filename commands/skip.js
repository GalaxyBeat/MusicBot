async function skip(serverQueue, textChannel) {
	if (!serverQueue) {
		return textChannel.send('Queue has not been setup for this server!');
	}
	else if (serverQueue.songs) {
		serverQueue.player.stop();
	}
	else {
		return textChannel.send('There are no songs to skip!');
	}
}

module.exports = {
	skip,
};