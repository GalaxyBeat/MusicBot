async function pause(serverQueue, textChannel) {
	if (!serverQueue) {
		return textChannel.send('Queue has not been setup for this server!');
	}
	
    if (serverQueue.songs) {
        if (serverQueue.player.state.status == "playing") {
            serverQueue.player.pause();
        }
        else {
            return textChannel.send('Song is in an unpausable state!');  
        }
	}
	else {
		return textChannel.send('There is no active song to pause!');
	}
}

module.exports = {
	pause,
};