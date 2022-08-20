async function clear(serverQueue, textChannel) {
	if (!serverQueue) {
		return textChannel.send('Queue has not been setup for this server!');
	}
	else if (serverQueue.songs) {
        serverQueue.songs = [];
		serverQueue.player.stop();

		return textChannel.send('Queue has been cleared!');
	}
	else {
		return textChannel.send('There are no songs to clear!');
	}
}

module.exports = {
	clear,
};