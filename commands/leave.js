async function leave(queue, serverQueue, guild, textChannel) {
	if (serverQueue) {
		serverQueue.connection.destroy();
		queue.delete(guild.id);
	}
	else {
		return textChannel.send('I am not in the channel!');
	}
}

module.exports = {
	leave,
};