async function resume(serverQueue, textChannel) {
	if (!serverQueue) {
		return textChannel.send('Queue has not been setup for this server!');
	}
	
    if (serverQueue.songs) {
        if (serverQueue.player.state.status == "paused") {
            serverQueue.player.unpause();
            return textChannel.send('Current song has been resumed!');  
        }
        else {
            return textChannel.send('Song is in an unresumable state!');  
        }
	}
	else {
		return textChannel.send('There is no active song to resume!');
	}
}

module.exports = {
	resume,
};